import { setMonitoring } from '#helpers/monitoring'
import { fetch, fetchAll } from '#utils/postgres'
import changeStatus from '#helpers/status'
import TransportQuery from '#sql/transport'
import ProductQuery from '#sql/product'
import BranchQuery from '#sql/branch'
import OrderQuery from '#sql/order'
import UserQuery from '#sql/user'


const transports = ({ 
	transportId, 
	pagination,
	isDeleted, 
	productId,
	available, 
	branchId, 
	orderId,
	staffId,
	search, 
	sort,
}) => {
	const { page, limit } = pagination

	const sortNameValues = { transportId: 1 }
	const sortObject = Object.keys(sort).map(key => {
		if(sort[key]) {
			return { sortKey: sortNameValues[key], value: sort[key] }
		}
	} ).filter( elem => elem !== undefined )[0]
	
	available = typeof(available) == 'boolean' ? !available : available

	return fetchAll(
		TransportQuery.TRANSPORTS,
		(page - 1) * limit, limit, isDeleted,
		transportId, branchId, available, search,
		staffId, orderId, productId,
		sortObject?.sortKey || 1, sortObject?.value || 1
	)
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const drivers = ({ transportId }) => {
	return fetchAll(TransportQuery.DRIVERS, transportId)
}

const staff = async ({ staffId }) => {
	const { staff } = await fetch(UserQuery.USER, false, 0, staffId, 0)
	return staff
}

const addTransport = ({ file, branchId, transportModel, transportColor, transportNumber, transportSummary }) => {
	return fetch(
		TransportQuery.ADD_TRANSPORT, 
		branchId, transportModel, transportColor, transportNumber, transportSummary, file
	)
}

const changeTransport = async ({ transportId, file, branchId, transportModel, transportColor, transportNumber, transportSummary }, { userId }) => {
	const updatedTransport = await fetch(
		TransportQuery.CHANGE_TRANSPORT, transportId, 
		branchId, transportModel, transportColor, transportNumber, transportSummary, file
	)

	if(updatedTransport) setMonitoring({ 
		userId, 
		sectionId: transportId,
		sectionName: 'transports', 
		operationType: 'changed',
		branchId: updatedTransport.old_branch_id,
	}, updatedTransport)

	return updatedTransport
}

const deleteTransport = async ({ transportId }, { userId }) => {
	for(let id of transportId) {
		const transport = await fetch(TransportQuery.CHECK_TRANSPORT, id)

		if(transport.registered) {
			throw new Error("Transportni o'chirish mumkin emas. Unga haydovchi biriktirilgan!")
		}

		if(transport.bound) {
			throw new Error("Transportni o'chirish mumkin emas. Unga buyurtma yoki buyumlar biriktirilgan!")
		}
	}

	const deletedTransports = []

	for(let id of transportId) {
		const deleted = await fetch(TransportQuery.DELETE_TRANSPORT, id)
		deleted && deletedTransports.push(deleted)
		deleted && setMonitoring({ 
			userId, 
			sectionId: id,
			sectionName: 'transports', 
			operationType: 'deleted',
			branchId: deleted.branch_id,
		}, deleted)
	}

	return deletedTransports
}

const restoreTransport = async ({ transportId }, { userId }) => {
	const restoredTransports = []

	for(let id of transportId) {
		const restored = await fetch(TransportQuery.RESTORE_TRANSPORT, id)
		restored && restoredTransports.push(restored)
		restored && setMonitoring({ 
			userId, 
			sectionId: id,
			sectionName: 'transports', 
			operationType: 'restored',
			branchId: restored.branch_id,
		}, restored)
	}

	return restoredTransports
}

const bindOrder = async ({ transportId, orderId = [], productId = [], type }, { staffId, userId }) => {
	const boundOrders = []

	for(let id of orderId) {
		const orderStatuses = await fetchAll(OrderQuery.ORDER_STATUSES, id)

		if(!orderStatuses.length) {
			throw new Error("Bunday buyurtma(lar) mavjud emas!")
		}

		const orderStatus = orderStatuses.at(-1)?.status_code

		if([
			(orderStatus == 6 && type == 1),
			(orderStatus == 2 && type == 2) 
		].every(cond => cond == false)) {
			throw new Error("Buyurtmani mashinaga biriktirish mumkin emas!")
		}

		const bound = await fetch(TransportQuery.BIND_ORDER, id, null, type, transportId)
		bound && await fetch(
			OrderQuery.CHANGE_ORDER_STATUS, id, 
			orderStatus == 6 ? 7 : orderStatus == 2 ? 3 : 3, 
			staffId
		)
		bound && await changeStatus({ orderId: id, staffId })
		bound && boundOrders.push(bound)
	}

	for(let id of productId) {
		const productStatuses = await fetchAll(ProductQuery.PRODUCT_STATUSES, id)

		if(!productStatuses.length) {
			throw new Error("Bunday buyum(lar) mavjud emas!")
		}

		const productStatus = productStatuses.at(-1)?.status_code

		if(
			!(productStatus == 7 && type == 1)
		) {
			throw new Error("Buyumni mashinaga biriktirish mumkin emas!")
		}

		const bound = await fetch(TransportQuery.BIND_ORDER, null, id, type, transportId)
		bound && await fetch(ProductQuery.CHANGE_PRODUCT_STATUS, id, 8, staffId)
		bound && await changeStatus({ productId: id, staffId })
		bound && boundOrders.push(bound)
	}

	return boundOrders
}

const unbindOrder = async ({ productId = [], orderId = [] }, { staffId }) => {
	const unboundOrders = []

	for(let id of orderId) {
		const orderStatuses = await fetchAll(OrderQuery.ORDER_STATUSES, id)

		if(!orderStatuses.length) {
			throw new Error("Bunday buyurtma(lar) mavjud emas!")
		}

		const orderStatus = orderStatuses.at(-1)?.status_code

		const bound = await fetch(TransportQuery.UNBOUND_ORDER, id, null)
		bound && await fetch(
			OrderQuery.CHANGE_ORDER_STATUS, id, 
			orderStatus == 7 ? 6 : orderStatus == 3 ? 2 : 2,
			staffId
		)
		bound && await changeStatus({ orderId: id, staffId })
		bound && unboundOrders.push(bound)
	}

	for(let id of productId) {
		const productStatuses = await fetchAll(ProductQuery.PRODUCT_STATUSES, id)

		if(!productStatuses.length) {
			throw new Error("Bunday buyum(lar) mavjud emas!")
		}

		const productStatus = productStatuses.at(-1)?.status_code
		const bound = await fetch(TransportQuery.UNBOUND_ORDER, null, id)
		bound && await fetch(ProductQuery.CHANGE_PRODUCT_STATUS, id, 7, staffId)
		bound && await changeStatus({ productId: id, staffId })
		bound && unboundOrders.push(bound)
	}

	return unboundOrders
}	

const registerTransport = ({ transportId, staffId }) => {
	return fetch(TransportQuery.REGISTER_TRANSPORT, transportId, staffId)
}


export default {
	registerTransport,
	restoreTransport,
	deleteTransport,
	changeTransport,
	addTransport,
	unbindOrder,
	transports,
	bindOrder,
	drivers,
	branch,
	staff,
}

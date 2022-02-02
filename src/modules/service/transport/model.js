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

const bindOrder = async ({ transportId, orderId = [], productId = [], type }, { staffId }) => {
	for(let id of orderId) {
		const orderStatuses = await fetchAll(OrderQuery.ORDER_STATUSES, id)
		const orderStatus = orderStatuses.at(-1)

		if(
			!(orderStatus.status_code == 6 && type == 1) ||
			!(orderStatus.status_code == 2 && type == 2) 
		) {
			throw new Error("Buyurtmani mashinaga biriktirish mumkin emas!")
		}
	}

	for(let id of productId) {
		const productStatuses = await fetchAll(ProductQuery.PRODUCT_STATUSES, id)
		const productStatus = productStatuses.at(-1)

		if(
			!(productStatus.status_code == 7 && type == 1)
		) {
			throw new Error("Buyumni mashinaga biriktirish mumkin emas!")
		}
	}

	const boundOrders = []

	for(let id of orderId) {
		const bound = await fetch(TransportQuery.BIND_ORDER, id, null, type, transportId)
		await fetch(OrderQuery.CHANGE_ORDER_STATUS, id, 7, staffId)
		await changeStatus({ orderId: id, staffId })
		boundOrders.push(bound)
	}

	for(let id of productId) {
		const bound = await fetch(TransportQuery.BIND_ORDER, null, id, type, transportId)
		await fetch(ProductQuery.CHANGE_PRODUCT_STATUS, id, 8, staffId)
		await changeStatus({ productId: id, staffId })
		boundOrders.push(bound)
	}

	return boundOrders
}


export default {
	transports,
	bindOrder,
	drivers,
	branch,
	staff,
}

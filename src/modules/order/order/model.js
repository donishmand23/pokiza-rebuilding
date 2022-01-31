import { checkUserInfo, checkContact, checkAddress } from '#helpers/checkInput'
import { fetch, fetchAll } from '#utils/postgres'
import TransportQuery from '#sql/transport'
import ProductQuery from '#sql/product'
import AddressQuery from '#sql/address'
import BranchQuery from '#sql/branch'
import OrderQuery from '#sql/order'
import UserQuery from '#sql/user'


const orders = ({
	sort,
	search,
	orderId,
	clientId,
	branchId,
	isDeleted,
	pagination,
	dateFilter,
	transportId,
	orderStatus,
	orderSpecial,
	addressFilter,
}, user) => {
	const sortNameValues = { orderId: 1, firstName: 2, lastName: 3, orderStatus: 4, orderPrice: 5, broughtTime: 6, deliveredTime: 7, bringTime: 8, deliveryTime: 9, addressDistance: 10 }
	const sortObject = Object.keys(sort).map(key => {
		if(sort[key]) {
			return { sortKey: sortNameValues[key], value: sort[key] }
		}
	}).filter( elem => elem !== undefined )[0]

	Object.keys(dateFilter).map(key => {
		dateFilter[key] = [dateFilter[key].from, dateFilter[key].to]
	})

	if(user.clientId) {
		clientId = [user.clientId]
	}

	const { page, limit } = pagination
	const { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter
	const { bringTime, broughtTime, deliveryTime, deliveredTime, orderCreatedAt } = dateFilter

	return fetchAll(
		OrderQuery.ORDERS,
		(page - 1) * limit, limit, isDeleted,
		orderId, clientId, branchId, orderStatus, orderSpecial, search,
		bringTime, broughtTime, deliveryTime, deliveredTime, orderCreatedAt,
		stateId, regionId, neighborhoodId, streetId, areaId, transportId,
		sortObject?.sortKey || 1, sortObject?.value || 1
	)
}

const orderStatuses = ({ orderId }) => {
	return fetchAll(OrderQuery.ORDER_STATUSES, orderId)
}

const products = ({ orderId }) => {
	return fetchAll(ProductQuery.PRODUCT, false, 0, orderId, 0, 0, 0)
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const address = ({ addressId }) => {
	return fetch(AddressQuery.ADDRESS, addressId)
}

const transport = ({ orderId }) => {
	return fetch(TransportQuery.TRANSPORT, null, 0, 0, orderId, 0)
}

const client = async ({ clientId }) => {
	const { client } = await fetch(UserQuery.USER, false, 0, 0, clientId)
	return client
}

const addOrder = async ({ clientId, special, summary, bringTime, address }, user) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target } = address

	if(user.staffId && !clientId) {
		throw new Error("clientId is required!")
	}

	if(user.clientId) {
		clientId = user.clientId
	}

	await checkAddress(address)

	return fetch(
		OrderQuery.ADD_ORDER,
		stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target,
		clientId, user.staffId,
		special, summary, bringTime,
	)
}

const changeOrder = async ({ orderId, bringTime, special, summary, address = {} }, { clientId }) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target } = address

	const statuses = await orderStatuses({ orderId })
	if(
		![1, 2, 3, 4].includes(+statuses[statuses.length - 1].status_code) &&
		(bringTime || special == false || special == true || address)
	) {
		throw new Error("Buyurtmaning ma'lumotlarini o'zgartirish mumkin emas!")
	}

	await checkAddress(address)

	return fetch(
		OrderQuery.CHANGE_ORDER, orderId, clientId, Boolean(Object.keys(address).length),
		stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target,
		bringTime, special, summary
	)
}

const changeOrderStatus = async ({ orderId, status, staffId }) => {
	if(![1, 2, 3, 7].includes(+status)) {
		throw new Error("Buyurtmani holatini faqat 'Moderator', 'Kutilmoqda', 'Biriktirilgan', 'Yetkazib berishda' holatlariga o'tkazish mumkin!")
	}

	const statuses = await orderStatuses({ orderId })
	const orderStatus = +statuses[statuses.length - 1].status_code
	if(status < orderStatus) {
		throw new Error("Buyurtma holatini orqaga qaytarish mumkin emas!")
	}

	if(status == orderStatus) {
		throw new Error("Buyurtma holatini allaqachon yangilangan!")
	}

	return fetch(OrderQuery.CHANGE_ORDER_STATUS, orderId, status, staffId)
}	

const deleteOrder = async ({ orderId }, { clientId }) => {
	orderId.map(async id => {
		const statuses = await orderStatuses({ orderId: id })
		if(
			(![1, 2, 3].includes(+statuses[statuses.length - 1].status_code) && clientId) ||
			(![1, 2, 3, 4, 5].includes(+statuses[statuses.length - 1].status_code) && !clientId)
		) {
			throw new Error("Buyurtmani o'chirish mumkin emas!")
		}
	})

	const deletedOrders = []
	for(let id of orderId) {
		const deletedOrder = await fetch(OrderQuery.DELETE_ORDER, id, clientId)
		if(deletedOrder) deletedOrders.push(deletedOrder)
	}
	return deletedOrders
}

const restoreOrder = async ({ orderId }, { clientId }) => {
	const restoredOrders = []
	for(let id of orderId) {
		const restoredOrder = await fetch(OrderQuery.RESTORE_ORDER, id, clientId)
		if(restoredOrder) restoredOrders.push(restoredOrder)
	}
	return restoredOrders
}


export default {
	changeOrderStatus,
	orderStatuses,
	restoreOrder,
	deleteOrder,
	changeOrder,
	transport,
	addOrder,
	products,
	address,
	client,
	branch,
	orders,
}

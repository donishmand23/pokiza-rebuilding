import { checkUserInfo, checkContact, checkAddress } from '#helpers/checkInput'
import { fetch, fetchAll } from '#utils/postgres'
import AddressQuery from '#sql/address'
import BranchQuery from '#sql/branch'
import UserQuery from '#sql/user'
import OrderQuery from '#sql/order'

const orders = ({
	sort,
	search,
	orderId,
	clientId,
	branchId,
	isDeleted,
	pagination,
	dateFilter,
	orderStatus,
	orderSpecial,
	addressFilter,
}, user) => {
	const sortNameValues = { orderId: 1, firstName: 2, lastName: 3, orderStatus: 4, broughtTime: 5, deliveredTime: 6, bringTime: 7, deliveryTime: 8 }
	const sortObject = Object.keys(sort).map(key => {
		if(sort[key]) {
			return { sortKey: sortNameValues[key], value: sort[key] }
		}
	} ).filter( elem => elem !== undefined )[0]

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
		stateId, regionId, neighborhoodId, streetId, areaId,
		sortObject?.sortKey || 1, sortObject?.value || 1
	)
}

const orderStatuses = ({ orderId }) => {
	return fetchAll(OrderQuery.ORDER_STATUSES, orderId)
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const address = ({ addressId }) => {
	return fetch(AddressQuery.ADDRESS, addressId)
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

const changeOrder = async ({ orderId, bringTime, special, summary, address }, user) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target } = address

	if(clientId) {
		throw new Error("clientId is required!")
	}

	await checkAddress(address)
}	


export default {
	orderStatuses,
	addOrder,
	address,
	client,
	branch,
	orders,
}
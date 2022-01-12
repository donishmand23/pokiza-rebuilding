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
}) => {
	const sortNameValues = { orderId: 1, firstName: 2, lastName: 3, orderStatus: 4, broughtTime: 5, deliveredTime: 6, bringTime: 7, deliveryTime: 8 }
	const sortObject = Object.keys(sort).map(key => {
		if(sort[key]) {
			return { sortKey: sortNameValues[key], value: sort[key] }
		}
	} ).filter( elem => elem !== undefined )[0]

	Object.keys(dateFilter).map(key => {
		dateFilter[key] = [dateFilter[key].from, dateFilter[key].to]
	})

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
	return fetchAll(AddressQuery.ADDRESS, addressId)
}

const client = async ({ clientId }) => {
	const { client } = await fetch(UserQuery.USER, false, 0, 0, clientId)
	return client
}


export default {
	orderStatuses,
	address,
	client,
	branch,
	orders,
}
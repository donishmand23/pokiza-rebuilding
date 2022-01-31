import { fetch, fetchAll } from '#utils/postgres'
import TransportQuery from '#sql/transport'
import BranchQuery from '#sql/branch'
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


export default {
	transports,
	drivers,
	branch,
	staff,
}

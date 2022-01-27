import { fetch, fetchAll } from '#utils/postgres'
import TransportQuery from '#sql/transport'
import BranchQuery from '#sql/branch'


const transports = ({ isDeleted, transportId, search, branchId, available, sort, pagination }) => {
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
		sortObject?.sortKey || 1, sortObject?.value || 1
	)
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

export default {
	transports,
	branch
}
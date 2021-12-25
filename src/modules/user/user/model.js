import { fetch, fetchAll } from '#utils/postgres'
import BranchQuery from '#sql/branch'
import AddressQuery from '#sql/address'


const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const address = ({ addressId }) => {
	return fetch(AddressQuery.ADDRESS, addressId)
}


export default {
	address,
	branch,
}
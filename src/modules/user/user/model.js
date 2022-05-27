import { fetch } from '#utils/postgres'
import AddressQuery from '#sql/address'
import BranchQuery from '#sql/branch'
import UserQuery from '#sql/user'


const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const address = ({ addressId }) => {
	return fetch(AddressQuery.ADDRESS, addressId)
}

const user = ({ userId }) => {
	return fetch(UserQuery.USER, false, userId, 0, 0)
}


export default {
	address,
	branch,
	user,
}
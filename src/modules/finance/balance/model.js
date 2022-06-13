import { fetch, fetchAll } from '#utils/postgres'
import BalanceQuery from '#sql/balance'
import BranchQuery from '#sql/branch'
import UserQuery from '#sql/user'

const balances = ({ staffId, branchId }, user) => {
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	return fetchAll(BalanceQuery.BALANCES, staffId, branchId, user.personal, user.personalBranchId, user.staffId)
}

const mainBalances = ({ branchId }, user) => {
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)
	
	return fetchAll(BalanceQuery.MAIN_BALANCES, branchId)
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const staff = async ({ staffId }) => {
	const { staff } = await fetch(UserQuery.USER, false, 0, staffId, 0)
	return staff
}

export default {
	mainBalances,
	balances,
	branch,
	staff,
}
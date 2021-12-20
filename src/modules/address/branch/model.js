import { fetch, fetchAll } from '#utils/postgres'
import BranchQuery from '#sql/branch'

const branches = ({ branchId = 0 }) => {
	return fetchAll(BranchQuery.BRANCHES, branchId)
}

const changeBranch = ({ branchName, branchId }) => {
	return fetch(BranchQuery.CHANGE_BRANCH, branchName, branchId)
}

const addBranch = ({ branchName }) => {
	return fetch(BranchQuery.ADD_BRANCH, branchName)
}

export default {
	changeBranch,
	addBranch,
	branches,
}
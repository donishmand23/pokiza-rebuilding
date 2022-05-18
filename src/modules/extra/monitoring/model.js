import { fetch, fetchAll } from '#utils/postgres'
import MonitoringQuery from '#sql/monitoring'
import BranchQuery from '#sql/branch'
import UserQuery from '#sql/user'

const monitoring = async ({ 
	userId, 
	branchId, 
	operationType, 
	dateFilter = {},
	sectionFilter = {} 
}) => {
	dateFilter = (dateFilter.from && dateFilter.to) ? [dateFilter.from, dateFilter.to] : []
	const { sectionName, sectionField, sectionId } = sectionFilter
	let data = []

	const productStatuses = await fetchAll(
		MonitoringQuery.PRODUCT_STATUSES, 
		userId, 
		branchId, 
		sectionId, 
		sectionName, 
		sectionField, 
		operationType,
		dateFilter
	); data = [...data, ...productStatuses]

	const orderStatuses = await fetchAll(
		MonitoringQuery.ORDER_STATUSES, 
		userId, 
		branchId, 
		sectionId, 
		sectionName, 
		sectionField, 
		operationType,
		dateFilter
	); data = [...data, ...orderStatuses]

	const monitoring = await fetchAll(
		MonitoringQuery.MONITORING, 
		userId, 
		branchId, 
		sectionId, 
		sectionName, 
		sectionField, 
		operationType,
		dateFilter
	); data = [...data, ...monitoring]

	return data
}

const user = ({ userId }) => {
	return fetch(UserQuery.USER, false, userId, 0, 0)
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

process.setMonitoring = async function ({ userId, branchId, operationType, sectionName, sectionField, sectionId, oldValue, newValue }) {
	await fetch(MonitoringQuery.ADD_MONITORING, userId, branchId, operationType, sectionName, sectionField, sectionId, oldValue, newValue)
}

export default {
	monitoring,
	branch,
	user
}
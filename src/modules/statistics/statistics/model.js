import { fetch, fetchAll } from '#utils/postgres'
import StatisticsQuery from '#sql/statistics'
import BranchQuery from '#sql/branch'

const ordersCountStatistics = ({
	branchId,
	dateFilter = {},
	addressFilter = {}
}, user) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter
	
	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	return fetch(
		StatisticsQuery.ORDERS_COUNT_STATISTICS,
		branchId, dateFilter,
		stateId, regionId, neighborhoodId, streetId, areaId
	)
}

const productServiceCountStatistics = ({
	branchId,
	dateFilter = {},
	addressFilter = {}
}, user) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter
	
	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	return fetchAll(
		StatisticsQuery.PRODUCTS_INFO_PER_SERVICE,
		branchId, dateFilter,
		stateId, regionId, neighborhoodId, streetId, areaId
	)
}

const productStatusesCountStatistics = ({
	branchId,
	serviceId,
	dateFilter = {},
}, user) => {
	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []

	if(branchId) branchId = [branchId]
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	return fetchAll(
		StatisticsQuery.PRODUCTS_INFO_PER_STATUS,
		branchId, serviceId, dateFilter
	)
}

const serviceProductsCountStatistics = ({
	branchId,
	statusCode,
	dateFilter = {}
}, user) => {
	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []

	if(branchId) branchId = [branchId]
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	return fetchAll(
		StatisticsQuery.SERVICE_PRODUCTS_COUNT,
		branchId, statusCode, dateFilter
	)
}

const branchFinanceStatistics = async ({
	branchId,
	dateFilter = {},
	financeDepartment,
}, user) => {
	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []

	if(branchId) branchId = [branchId]
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)
	
	if (financeDepartment === 'debt') {
		return await fetchAll(StatisticsQuery.BRANCH_DEBT_STATISTICS, branchId, dateFilter)
	}

	if (financeDepartment === 'sale') {
		return await fetchAll(StatisticsQuery.BRANCH_ORDER_SALE_STATISTICS, branchId, dateFilter)
	}

	if (financeDepartment === 'expanse') {
		return await fetchAll(StatisticsQuery.BRANCH_EXPANSE_STATISTICS, branchId, dateFilter)
	}
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}


export default {
	serviceProductsCountStatistics,
	productStatusesCountStatistics,
	productServiceCountStatistics,
	branchFinanceStatistics,
	ordersCountStatistics,
	branch
}

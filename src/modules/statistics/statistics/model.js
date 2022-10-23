import { fetch, fetchAll } from '#utils/postgres'
import StatisticsQuery from '#sql/statistics'

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


export default {
	serviceProductsCountStatistics,
	productStatusesCountStatistics,
	productServiceCountStatistics,
	ordersCountStatistics,
}

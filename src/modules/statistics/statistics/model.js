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

const productsCountStatistics = ({
	branchId,
	dateFilter = {},
	addressFilter = {}
}, user) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter
	
	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)
	console.log(branchId)
	return fetchAll(
		StatisticsQuery.PRODUCTS_INFO_PER_SERVICE,
		[1, 2], dateFilter,
		stateId, regionId, neighborhoodId, streetId, areaId
	)
}


export default {
	productsCountStatistics,
	ordersCountStatistics,
}

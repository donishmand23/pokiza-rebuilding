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

	return fetchAll(
		StatisticsQuery.ORDERS_COUNT_STATISTICS,
		branchId, dateFilter,
		stateId, regionId, neighborhoodId, streetId, areaId
	)
}


export default {
	ordersCountStatistics,
}

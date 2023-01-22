import { fetch, fetchAll } from '#utils/postgres'
import StatisticsQuery from '#sql/statistics'
import ServiceQuery from '#sql/service'
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

const branchFinanceStatistics = ({
	branchId,
	dateFilter = {},
	financeDepartment,
}, user) => {
	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []

	if(branchId) branchId = [branchId]
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)
	
	if (financeDepartment === 'debt') {
		return fetchAll(StatisticsQuery.BRANCH_DEBT_STATISTICS, branchId, dateFilter)
	}

	if (financeDepartment === 'sale') {
		return fetchAll(StatisticsQuery.BRANCH_ORDER_SALE_STATISTICS, branchId, dateFilter)
	}

	if (financeDepartment === 'expanse') {
		return fetchAll(StatisticsQuery.BRANCH_EXPANSE_STATISTICS, branchId, dateFilter)
	}
}

const serviceSummaryStatistics = async ({
	year,
	branchId,
	addressFilter = {},
}, user) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter

	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	const services = await fetchAll(ServiceQuery.SERVICES, null, 0, branchId)

	const result = services.map(async service => {
		service.monthlySummary = await fetchAll(
			StatisticsQuery.SERVICE_SUMMARY_STATISTICS,
			service.service_id, year,
			stateId, regionId, neighborhoodId, streetId, areaId
		)

		return service
	}) 
	
	return Promise.all(result)
}

const socialSetRegistrationStatistics = ({
	branchId,
	dateFilter = {},
	addressFilter = {},
}, user) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter

	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	return fetchAll(
		StatisticsQuery.SOCIAL_SET_REGISTRATION_STATISTICS,
		branchId, dateFilter,
		stateId, regionId, neighborhoodId, streetId, areaId
	)
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}


export default {
	socialSetRegistrationStatistics,
	serviceProductsCountStatistics,
	productStatusesCountStatistics,
	productServiceCountStatistics,
	serviceSummaryStatistics,
	branchFinanceStatistics,
	ordersCountStatistics,
	branch
}

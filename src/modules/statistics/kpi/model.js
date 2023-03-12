import { fetch, fetchAll } from '#utils/postgres'
import ServiceQuery from '#sql/service'
import KPIQuery from '#sql/kpi'


const productsKPI = ({
	staffId,
	branchId,
	statusCode,
	dateFilter = {},
}, user) => {
	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []

	if (branchId) branchId = [branchId]
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	return fetchAll(
		KPIQuery.PRODUCTS_KPI,
		branchId, staffId, statusCode, dateFilter
	)
}

const service = ({ serviceId, isDeleted = null }) => {
	return fetch(ServiceQuery.SERVICES, isDeleted, serviceId, [])
}

export default {
	productsKPI,
	service
}

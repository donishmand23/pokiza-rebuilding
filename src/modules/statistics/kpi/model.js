import { fetch, fetchAll } from '#utils/postgres'
import ServiceQuery from '#sql/service'
import UserQuery from '#sql/user'
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

const productStatusesKPI = ({
	staffId,
	branchId,
	productId,
	dateFilter = {},
}, user) => {
	dateFilter = Object.keys(dateFilter).length ? [dateFilter.from, dateFilter.to] : []
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	return fetchAll(
		KPIQuery.PRODUCT_STATUSES_KPI,
		branchId, staffId, productId, dateFilter
	)
}

const service = ({ serviceId, isDeleted = null }) => {
	return fetch(ServiceQuery.SERVICES, isDeleted, serviceId, [])
}

const staff = async ({ staffId }) => {
	const { staff } = await fetch(UserQuery.USER, false, 0, staffId, 0)
	return staff
}

export default {
	productStatusesKPI,
	productsKPI,
	service,
	staff
}

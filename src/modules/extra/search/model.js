import { fetchAll } from '#utils/postgres'
import StaffQuery from '#sql/staff'
import ClientQuery from '#sql/client'
import OrderQuery from '#sql/order'
import ProductQuery from '#sql/product'
import TransportQuery from '#sql/transport'


const searchStaffs = ({ key, branchId }) => {
	return fetchAll(StaffQuery.SEARCH_STAFFS, key, branchId, 10)
}

const searchClients = ({ key, branchId }) => {
	return fetchAll(ClientQuery.SEARCH_CLIENTS, key, branchId, 10)
}

const searchOrders = ({ key, branchId }) => {
	return fetchAll(OrderQuery.SEARCH_ORDERS, key, branchId, 10)
}

const searchProducts = ({ key, branchId }) => {
	return fetchAll(ProductQuery.SEARCH_PRODUCTS, key, branchId, 10)
}

const searchTransports = ({ key, branchId }) => {
	return fetchAll(TransportQuery.SEARCH_TRANSPORTS, key, branchId, 10)
}

const searchGlobal = async ({ key }, user) => {
	const branchId = Array.prototype.equalize([], user.allowedBranches)

	const staffs = await searchStaffs({ key, branchId })
	const clients = await searchClients({ key, branchId })
	const orders = await searchOrders({ key, branchId })
	const products = await searchProducts({ key, branchId })
	const transports = await searchTransports({ key, branchId })

	return [...staffs, ...clients, ...orders, ...products, ...transports ]
}


export default {
	searchGlobal
}
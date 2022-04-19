import { fetchAll } from '#utils/postgres'
import StaffQuery from '#sql/staff'
import ClientQuery from '#sql/client'
import OrderQuery from '#sql/order'
import ProductQuery from '#sql/product'
import TransportQuery from '#sql/transport'


const searchStaffs = ({ key }) => {
	return fetchAll(StaffQuery.SEARCH_STAFFS, key, [])
}

const searchClients = ({ key }) => {
	return fetchAll(ClientQuery.SEARCH_CLIENTS, key, [])
}

const searchOrders = ({ key }) => {
	return fetchAll(OrderQuery.SEARCH_ORDERS, key, [])
}

const searchProducts = ({ key }) => {
	return fetchAll(ProductQuery.SEARCH_PRODUCTS, key, [])
}

const searchTransports = ({ key }) => {
	return fetchAll(TransportQuery.SEARCH_TRANSPORTS, key, [])
}

const searchGlobal = async ({ key }) => {
	const staffs = await searchStaffs({ key })
	const clients = await searchClients({ key })
	const orders = await searchOrders({ key })
	const products = await searchProducts({ key })
	const transports = await searchTransports({ key })

	return [...staffs, ...clients, ...orders, ...products, ...transports ]
}


export default {
	searchGlobal
}
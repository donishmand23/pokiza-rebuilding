import { fetch, fetchAll } from '#utils/postgres'
import code from '#helpers/randomNumberGenerator'
import StaffQuery from '#sql/staff'
import ClientQuery from '#sql/client'
import UserQuery from '#sql/user'


const searchStaffs = async ({ key }) => {
	return fetchAll(
		StaffQuery.SEARCH_STAFFS, 
		Number(key) || 0, 
		String(key).length >= 4 ? String(key) : '__WW-' + code(8),
		[]
	)
}

const searchClients = async ({ key }) => {
	return fetchAll(
		ClientQuery.SEARCH_CLIENTS, 
		Number(key) || 0, 
		String(key).length >= 4 ? String(key) : '__WW-' + code(8),
		[]
	)
}

const searchGlobal = async ({ key }) => {
	const staffs = await searchStaffs({ key })
	const clients = await searchClients({ key })

	return [ ...staffs, ...clients ]
}


export default {
	searchClients,
	searchStaffs,
	searchGlobal,
}
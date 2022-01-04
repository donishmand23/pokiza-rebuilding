import { fetch, fetchAll } from '#utils/postgres'
import code from '#helpers/randomNumberGenerator'
import StaffQuery from '#sql/staff'
import ClientQuery from '#sql/client'
import UserQuery from '#sql/user'


const searchStaffs = ({ key }) => {
	return fetchAll(StaffQuery.SEARCH_STAFFS, key, [])
}

const searchClients = ({ key }) => {
	return fetchAll(ClientQuery.SEARCH_CLIENTS, key, [])
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
import { fetch, fetchAll } from '#utils/postgres'
import UserQuery from '#sql/user'

const userContacts = async ({ user, branchId, userId, staffId }) => {
	const contacts = await fetchAll(UserQuery.USER_CONTACTS, user, branchId, userId, staffId)
	return contacts.map(e => e.con)
}

export default {
	userContacts,
}
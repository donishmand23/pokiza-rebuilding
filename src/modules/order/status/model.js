import { fetch } from '#utils/postgres'
import UserQuery from '#sql/user'

const staff = async ({ staffId }) => {
	const { staff } = await fetch(UserQuery.USER, false, 0, staffId, 0)
	return staff
}

export default {
	staff,
}
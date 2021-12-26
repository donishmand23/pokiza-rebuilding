import { fetch, fetchAll } from '#utils/postgres'
import StaffQuery from '#sql/staff'
import UserQuery from '#sql/user'


const staffs = ({ 
	sort,
	staffId,
	pagination,
	userSearch,
	addressFilter,
	userInfoFilter,
}) => {
	const { page, limit } = pagination
	const { age, gender, branchId } = userInfoFilter
	const { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter
	const sortNameValues = { firstName: 1, lastName: 2, age: 3, userId: 4, userCreatedAt: 5 }

	const sortObject = Object.keys(sort).map( key => {
		if(sort[key]) {
			return { sortKey: sortNameValues[key], value: sort[key] }
		}
	} ).filter( elem => elem !== undefined )[0]

	return fetchAll(
		StaffQuery.STAFFS,
		(page - 1) * limit, limit,
		staffId, [age.from, age.to], gender, branchId, userSearch,
		stateId, regionId, neighborhoodId, streetId, areaId,
		sortObject?.sortKey || 4, sortObject?.value || 1
	)
}

const user = ({ userId }) => {
	return fetch(UserQuery.USERS, userId)
}


export default {
	staffs,
	user
}
import { fetch, fetchAll } from '#utils/postgres'
import ClientQuery from '#sql/client'
import SocialSetQuery from '#sql/socialSet'
import UserQuery from '#sql/user'


const clients = ({ 
	sort,
	clientId,
	userSearch,
	pagination, 
	socialSetId,
	clientStatus, 
	addressFilter,
	userInfoFilter, 
}) => {
	const { page, limit } = pagination
	const { age, gender, branchId } = userInfoFilter
	const { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter
	const sortNameValues = { firstName: 1, lastName: 2, age: 3, userJoinedAt: 4, clientId: 5, clientStatus: 6, clientCreatedAt: 7 }

	const sortObject = Object.keys(sort).map( key => {
		if(sort[key]) {
			return { sortKey: sortNameValues[key], value: sort[key] }
		}
	} ).filter( elem => elem !== undefined )[0]

	return fetchAll(
		ClientQuery.CLIENTS,
		(page - 1) * limit, limit,
		clientId, clientStatus, socialSetId,
		[age.from, age.to], gender, branchId, userSearch,
		stateId, regionId, neighborhoodId, streetId, areaId,
		sortObject?.sortKey || 5, sortObject?.value || 1
	)
}

const socialSet = ({ socialSetId }) => {
	return fetch(SocialSetQuery.SOCIAL_SETS, socialSetId)
}

const user = ({ userId }) => {
	return fetch(UserQuery.USERS, userId)
}


export default {
	socialSet,
	clients,
	user
}
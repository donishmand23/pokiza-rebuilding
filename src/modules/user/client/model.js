import { checkUserInfo, checkContact, checkAddress } from '#helpers/checkInput'
import { fetch, fetchAll } from '#utils/postgres'
import ClientQuery from '#sql/client'
import SocialSetQuery from '#sql/socialSet'
import UserQuery from '#sql/user'

const clients = ({ 
	sort,
	search,
	clientId,
	isDeleted,
	pagination, 
	socialSetId,
	clientStatus, 
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
		ClientQuery.CLIENTS,
		(page - 1) * limit, limit, isDeleted,
		clientId, clientStatus, socialSetId,
		[age?.from || 0, age?.to || 0], gender, branchId, search,
		stateId, regionId, neighborhoodId, streetId, areaId,
		sortObject?.sortKey || 4, sortObject?.value || 1
	)
}

const socialSet = ({ socialSetId }) => {
	return fetch(SocialSetQuery.SOCIAL_SETS, socialSetId)
}

const user = ({ userId }) => {
	return fetch(UserQuery.USERS, userId)
}

const addClient = async ({ mainContact, socialSetId, clientStatus, clientSummary, userInfo, userAddress }) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target } = userAddress
	const { firstName, lastName, secondContact, birthDate, gender } = userInfo

	await checkContact(mainContact)
	await checkUserInfo(userInfo)
	await checkAddress(userAddress)

	return fetch(
		ClientQuery.ADD_CLIENT,
		stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target,
		mainContact, secondContact, firstName, lastName, birthDate, gender,
		clientStatus, socialSetId, clientSummary
	)
}

const changeClient = async ({ clientId, clientStatus, clientSummary, userInfo, userAddress }) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target } = userAddress
	const { firstName, lastName, mainContact, secondContact, birthDate, gender } = userInfo
	
	await checkContact(mainContact)
	await checkAddress(userAddress)

	return fetch(
		ClientQuery.CHANGE_CLIENT, clientId, Boolean(Object.keys(userAddress).length),
		stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target,
		mainContact, secondContact, firstName, lastName, birthDate, gender,
		clientStatus, clientSummary
	)
}

const deleteClient = async ({ clientId }) => {
	const deletedClients = []
	for(let id of clientId) {
		const deletedClient = await fetch(ClientQuery.DELETE_CLIENT, id)
		if(deletedClient) deletedClients.push(deletedClient)
	}
	return deletedClients
}

const restoreClient = async ({ clientId }) => {
	const restoredClients = []
	for(let id of clientId) {
		const restoredClient = await fetch(ClientQuery.RESTORE_CLIENT, id)
		if(restoredClient) restoredClients.push(restoredClient)
	}
	return restoredClients
}

const enterClientPhone = async ({ mainContact, code }) => {
	const user = await fetch(ClientQuery.CHANGE_CLIENT_PASSWORD, 0, mainContact, code)
	if(!user) return fetch(UserQuery.ADD_USER, mainContact, code)
	return user
}

const enterClientPassword = async ({ password, userId, code }) => {
	const user = await fetch(ClientQuery.CHECK_CLIENT_PASSWORD, userId, password)
	if(!user) throw new Error("Wrong password or username!")
	await fetch(ClientQuery.CHANGE_CLIENT_PASSWORD, userId, '', code)
	if(!user.client_id) return fetch(ClientQuery.ADD_CLIENT_PART, user.user_id)
	return user
}

const fillClientData = async ({ clientId, socialSetId, clientStatus, clientSummary, userInfo, userAddress }) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target } = userAddress
	const { firstName, lastName, secondContact, birthDate, gender } = userInfo
	
	await checkUserInfo(userInfo)
	await checkAddress(userAddress)

	return fetch(
		ClientQuery.FILL_CLIENT_DATA, clientId,
		stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target,
		secondContact, firstName, lastName, birthDate, gender,
		socialSetId, clientStatus, clientSummary
	)
}

export default {
	enterClientPassword,
	enterClientPhone,
	fillClientData,
	restoreClient,
	deleteClient,
	changeClient,
	addClient,
	socialSet,
	clients,
	user
}
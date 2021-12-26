import { fetch, fetchAll } from '#utils/postgres'
import StateQuery from '#sql/state'
import RegionQuery from '#sql/region'
import NeighborhoodQuery from '#sql/neighborhood'
import StreetQuery from '#sql/street'
import AreaQuery from '#sql/area'
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
	const sortNameValues = { firstName: 1, lastName: 2, age: 3, userId: 4, userCreatedAt: 5 }

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
	await checkAddress(userAddress)

	return fetch(
		ClientQuery.ADD_CLIENT,
		stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target,
		mainContact, secondContact, firstName, lastName, birthDate, gender,
		clientStatus, socialSetId, clientSummary
	)
}

const changeClient = async ({ clientId, clientStatus = 0, clientSummary, userInfo, userAddress }) => {
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

export default {
	changeClient,
	addClient,
	socialSet,
	clients,
	user
}














async function checkContact (mainContact) {
	const user = await fetch(UserQuery.CHECK_USER_CONTACT, mainContact)
	if(user) {
		throw new Error(`${mainContact} allaqachon ro'yxatdan o'tazilgan!`)
	}
}

async function checkAddress (userAddress) {
	const { stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target } = userAddress

	const state = await fetch(StateQuery.STATES, stateId)
	if(!state) {
		throw new Error("Kiritilgan viloyat mavjud emas!")
	}

	const region = await fetch(RegionQuery.REGIONS, stateId, regionId)
	if(!region) {
		throw new Error("Kiritilgan tumam kiritilgan viloyatga qarashli emas!")
	}

	if(neighborhoodId) {
		const neighborhood = await fetch(NeighborhoodQuery.NEIGHBORHOODS, regionId, neighborhoodId)
		if(!neighborhood) throw new Error("Kiritilgan mahalla kiritilgan tumanga qarashli emas!")
	}

	if(!neighborhoodId && streetId) throw new Error("Ko'chani kirgazish uchun avval mahallani kiritish zarur!")
	if(streetId) {
		const street = await fetch(StreetQuery.STREETS, regionId, neighborhoodId, streetId)
		if(!street) throw new Error("Kiritilgan ko'cha kiritilgan mahallaga qarashli emas!")
	}

	if(!streetId && areaId) throw new Error("Hududni kirgazish uchun avval ko'chani kiritish zarur!")
	if(areaId) {
		const area = await fetch(AreaQuery.AREAS, regionId, neighborhoodId, streetId, areaId)
		if(!area) throw new Error("Kiritilgan hudud kiritilgan ko'chaga qarashli emas!")
	}
}
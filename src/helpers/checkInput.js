import { fetch, fetchAll } from '#utils/postgres'
import StateQuery from '#sql/state'
import RegionQuery from '#sql/region'
import NeighborhoodQuery from '#sql/neighborhood'
import StreetQuery from '#sql/street'
import AreaQuery from '#sql/area'
import UserQuery from '#sql/user'


async function checkContact (mainContact) {
	const user = await fetch(UserQuery.CHECK_USER_CONTACT, mainContact)
	if(user) {
		throw new Error(`${mainContact} allaqachon ro'yxatdan o'tazilgan!`)
	}
}

async function checkUserInfo (userInfo) {
	const { firstName, lastName, secondContact, birthDate, gender } = userInfo
	if(!firstName) {
		throw new Error(`firstName is required!`)
	}

	if(!birthDate) {
		throw new Error(`birthDate is required!`)
	}

	if(!gender) {
		throw new Error(`gender is required!`)
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


export {
	checkUserInfo,
	checkContact,
	checkAddress,
}
import { fetch, fetchAll } from '#utils/postgres'
import RegionQuery from '#sql/region'
import NeighborhoodQuery from '#sql/neighborhood'
import StreetQuery from '#sql/street'
import AreaQuery from '#sql/area'

const neighborhoods = async ({ streetId }) => {
	return fetchAll(NeighborhoodQuery.NEIGHBORHOODS_FOR_STREETS, streetId)
}

const streets = ({ neighborhoodId = 0, regionId = 0, streetId = 0 }) => {
	return fetchAll(StreetQuery.STREETS, regionId, neighborhoodId, streetId)
}

const region = ({ streetId }) => {
	return fetch(RegionQuery.REGIONS_FOR_STREETS, streetId)
}

const areas = ({ streetId }) => {
	return fetchAll(AreaQuery.AREAS_FOR_STREETS, streetId)
}

const addStreet = async ({ neighborhoodId, streetName, streetDistance }) => {
	let newStreet = await fetch(StreetQuery.ADD_STREET, streetName, streetDistance)
	for (let e of neighborhoodId) {
		await fetch(StreetQuery.ADD_NEIGHBORHOOD_STREETS, e, newStreet.street_id)
	}
	return newStreet
}

const changeStreet = async ({ streetId, neighborhoodId, streetName = '', streetDistance = 0 }) => {
	let oldData = await fetch(StreetQuery.STREETS, 0, 0, streetId)
	if(!oldData) throw "Bunday ko'cha mavjud emas!"
	if(neighborhoodId && neighborhoodId.length != 0) {
		await fetch(StreetQuery.DELETE_NEIGHBORHOOD_STREETS, streetId)
		for (let e of neighborhoodId) {
			await fetch(StreetQuery.ADD_NEIGHBORHOOD_STREETS, e, streetId)
		}
	}
	return fetch( StreetQuery.CHANGE_STREET, streetId, streetName, streetDistance)
}

export default {
	neighborhoods,
	changeStreet,
	addStreet,
	streets,
	region,
	areas,
}
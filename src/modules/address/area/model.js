import { BadRequestError } from '#errors'
import { fetch, fetchAll } from '#utils/postgres'
import NeighborhoodQuery from '#sql/neighborhood'
import StreetQuery from '#sql/street'
import AreaQuery from '#sql/area'

const neighborhood = ({ areaId }) => {
	return fetch(NeighborhoodQuery.NEIGHBORHOODS_FOR_AREAS, areaId)
}

const streets = async ({ areaId }) => {
	return fetchAll(StreetQuery.STREETS_FOR_AREAS, areaId)
}

const areas = ({ regionId = 0, neighborhoodId = 0, streetId = 0, areaId = 0 }) => {
	return fetchAll(AreaQuery.AREAS, regionId, neighborhoodId, streetId, areaId)
}

const addArea = async ({ streetId, areaName, areaDistance }) => {
	let newArea = await fetch(AreaQuery.ADD_AREA, areaName, areaDistance)
	for (let e of streetId) {
		await fetch(AreaQuery.ADD_STREET_AREAS, e, newArea.area_id)
	}
	return newArea
}

const changeArea = async ({ areaId, streetId, areaName = '', areaDistance = 0 })   => {
	let oldData = await fetch(AreaQuery.AREAS, 0, 0, 0, areaId)
	if(!oldData) throw new BadRequestError("Bunday hudud yo'q!")
	if(streetId && streetId.length != 0) {
		await fetch(AreaQuery.DELETE_STREET_AREAS, areaId)
		for (let e of streetId) {
			await fetch(AreaQuery.ADD_STREET_AREAS, e, areaId)
		}
	}
	return fetch(AreaQuery.CHANGE_AREA, areaId, areaName, areaDistance)
}


export default {
	neighborhood,
	changeArea,
	addArea,
	streets,
	areas,
}
import { fetch, fetchAll } from '#utils/postgres'
import RegionQuery from '#sql/region'
import NeighborhoodQuery from '#sql/neighborhood'
import StreetQuery from '#sql/street'

const neighborhoods = ({ regionId = 0, neighborhoodId = 0 }) => {
	return fetchAll(NeighborhoodQuery.NEIGHBORHOODS, regionId, neighborhoodId)
}

const streets = ({ neighborhoodId }) => {
	return fetchAll(StreetQuery.STREETS_FOR_NEIGHBORHOODS, neighborhoodId)
}

const region = ({ regionId }) => {
	return fetch(RegionQuery.REGIONS, 0, regionId)
}

const addNeighborhood = ({ regionId, neighborhoodName, neighborhoodDistance }) => {
	return fetch(
		NeighborhoodQuery.ADD_NEIGHBORHOOD, 
		regionId, 
		neighborhoodName, 
		neighborhoodDistance
	)
}

const changeNeighborhood = ({ neighborhoodId, regionId = 0, neighborhoodName = '', neighborhoodDistance = 0 }) => {
	return fetch(
		NeighborhoodQuery.CHANGE_NEIGHBORHOOD,
		neighborhoodId, 
		neighborhoodName,
		neighborhoodDistance,
		regionId
	)
}


export default {
	changeNeighborhood,
	addNeighborhood,
	neighborhoods,
	streets,
	region
}
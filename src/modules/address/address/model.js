import { fetch, fetchAll } from '#utils/postgres'
import BranchQuery from '#sql/branch'
import StateQuery from '#sql/state'
import RegionQuery from '#sql/region'
import NeighborhoodQuery from '#sql/neighborhood'
import StreetQuery from '#sql/street'
import AreaQuery from '#sql/area'

const Query = {
	...NeighborhoodQuery, 
	...StreetQuery, 
	...RegionQuery, 
	...BranchQuery,
	...StateQuery, 
	...AreaQuery,
}

const neighborhood = ({ neighborhoodId }) => {
	return neighborhoodId && fetch(NeighborhoodQuery.NEIGHBORHOODS, 0, neighborhoodId)
}

const region = ({ regionId }) => {
	return regionId && fetch(RegionQuery.REGIONS, 0, regionId)
}

const street = ({ streetId }) => {
	return streetId && fetch(StreetQuery.STREETS, 0, 0, streetId)
}

const state = ({ stateId }) => {
	return stateId && fetch(StateQuery.STATES, stateId)
}

const area = ({ areaId }) => {
	return areaId && fetch(AreaQuery.AREAS, 0, 0, 0, areaId)
}

const disableEnable = ({ addressField, addressFieldId, uzNames, actionName }) => {
	return addressFieldId.map( async id => {
		const item = await fetch(Query[`${actionName.toUpperCase()}_${addressField.toUpperCase()}`], id)
		if(!item) throw new Error(`${id} idlik ${uzNames[addressField]} mavjud emas!`)
		return item
	} )
}

const addresses = ({ addressField, addressFilter }) => {
	switch(addressField) {
		case 'branch': {
			const { branch = {} } = addressFilter
			const { branchId } = state
			return fetchAll(BranchQuery.DISABLED_BRANCHES, branchId)
		}
		case 'state': {
			const { state = {} } = addressFilter
			const { stateId } = state
			return fetchAll(StateQuery.DISABLED_STATES, stateId)
		}
		case 'region': {
			const { region = {} } = addressFilter
			const { stateId, regionId } = region
			return fetchAll(RegionQuery.DISABLED_REGIONS, stateId, regionId)
		}
		case 'neighborhood': {
			const { neighborhood = {} } = addressFilter
			const { regionId, neighborhoodId } = neighborhood
			return fetchAll(NeighborhoodQuery.DISABLED_NEIGHBORHOODS, regionId, neighborhoodId)
		}
		case 'street': {
			const { street = {} } = addressFilter
			const { regionId, neighborhoodId, streetId } = street
			return fetchAll(StreetQuery.DISABLED_STREETS, regionId, neighborhoodId, streetId)
		}
		case 'area': {
			const { area = {} } = addressFilter
			const { regionId, neighborhoodId, streetId, areaId } = area
			return fetchAll(AreaQuery.DISABLED_AREAS, regionId, neighborhoodId, streetId, areaId)
		}
	}
}


export default {
	disableEnable,
	neighborhood,
	addresses,
	region,
	street,
	state,
	area,
}
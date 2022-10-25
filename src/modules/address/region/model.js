import { fetch, fetchAll } from '#utils/postgres'
import BranchQuery from '#sql/branch'
import StateQuery from '#sql/state'
import RegionQuery from '#sql/region'
import NeighborhoodQuery from '#sql/neighborhood'

const branch = async ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const state = ({ stateId }) => {
	return fetch(StateQuery.STATES, stateId)
}

const neighborhoods = ({ regionId }) => {
	return fetchAll(NeighborhoodQuery.NEIGHBORHOODS, regionId, 0, 0)
}

const regions = ({ stateId = 0, regionId = 0 }) => {
	return fetchAll(RegionQuery.REGIONS, stateId, regionId)
}

const addRegion = ({ stateId, regionName, branchId }) => {
	return fetch(RegionQuery.ADD_REGION, stateId, regionName, branchId)
}

const changeRegion = ({ regionId, stateId = 0, branchId = 0, regionName = '' }) => {
	return fetch(RegionQuery.CHANGE_REGION, regionId, regionName, stateId, branchId)
}


export default {
	neighborhoods,
	changeRegion,
	addRegion,
	regions,
	branch,
	state,
}
import { fetch, fetchAll } from '#utils/postgres'
import StateQuery from '#sql/state'
import RegionQuery from '#sql/region'

const states = ({ stateId = 0 }) => {
	return fetchAll(StateQuery.STATES, stateId) 
}

const changeState = ({ stateId, stateName }) => {
	return fetch(StateQuery.CHANGE_STATE, stateId, stateName)
}

const addState = ({ stateName }) => {
	return fetch(StateQuery.ADD_STATE, stateName)
}

const regions = ({ stateId }) => {
	return fetchAll(RegionQuery.REGIONS, stateId, 0)
}


export default {
	changeState,
	addState,
	regions,
	states,
}
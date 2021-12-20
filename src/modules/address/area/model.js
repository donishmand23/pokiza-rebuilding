import { fetch, fetchAll } from '#utils/postgres'
import StateQuery from '#sql/state'

const states = ({ stateId = 0 }) => {
	return fetchAll(StateQuery.STATES, stateId) 
}

const changeState = ({ stateId, stateName }) => {
	return fetch(StateQuery.CHANGE_STATE, stateId, stateName)
}

const addState = ({ stateName }) => {
	return fetch(StateQuery.ADD_STATE, stateName)
}


export default {
	changeState,
	addState,
	states,
}
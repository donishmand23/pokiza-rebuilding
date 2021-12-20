import stateModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		changeState: async (_, { stateId, stateName }, { token }) => {
			try {
				let payload = await permission(token, { branchId }, 302)
				if (payload && payload.staff) {
					const updatedState = await stateModel.changeStateName(stateId, stateName)
					if (updatedState) {
						return {
							status: 200,
							message: "The state name has been updated!",
							data: updatedState
						}
					} else throw 'There is an error in updating state name!'
				} else throw "You don't have a permission for this operation!"
			} catch (error) { return mError(error) }
		},

		addState: async (_, { stateName }, { token }) => {
			try {
				let payload = await permission(token, { branchId }, 304)
				if (payload && payload.staff) {
					const newState = await stateModel.addState(stateName)
					if (newState) {
						return {
							status: 200,
							message: "A new state has been added!",
							data: newState
						}
					} else throw 'There is an error in adding a new state!'
				} else throw "You don't have a permission for this operation!"
			} catch (error) { return mError(error) }
		}
	},
	Query: {
		states: async (_, arg) => {
			try {
				const states = await stateModel.states(arg)
				return states
			} catch (error) {
				throw error
			}
		}
	},
	State: {
		stateId: global => global.state_id,
		stateName: global => global.state_name,
		stateCreatedAt: global => global.state_created_at,
		// regions: async global => await stateModel.regions(global.state_id)
	},
}
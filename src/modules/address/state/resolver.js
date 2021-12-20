import stateModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addState: async (_, arg) => {
			try {
				const newState = await stateModel.addState(arg)
				if(newState) {
					return {
						status: 200,
						message: "Yangi viloyat qo'shildi!",
						data: newState
					}
				} throw new Error("Viloyat qo'shishda muammolik yuz berdi!")
			} catch (error) { return mError(error) }
		},

		changeState: async (_, arg) => {
			try {
				const updatedState = await stateModel.changeState(arg)
				if(updatedState) {
					return {
						status: 200,
						message: "Viloyat nomi yangilandi!",
						data: updatedState
					}
				} throw new Error("Bunday viloyat mabjud emas!")
			} catch (error) { return mError(error) }
		},
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
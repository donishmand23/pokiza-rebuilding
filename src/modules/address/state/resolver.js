import { BadRequestError, InternalServerError } from '#errors'
import stateModel from './model.js'

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
				} throw new InternalServerError("Viloyat qo'shishda muammolik yuz berdi!")
			} catch (error) { 
				throw error
			 }
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
				} throw new BadRequestError("Bunday viloyat mabjud emas!")
			} catch (error) { 
				throw error
			 }
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
		regions: async global => await stateModel.regions({ stateId: global.state_id })
	},
}
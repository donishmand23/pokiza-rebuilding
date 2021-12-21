import streetModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addStreet: async (_, args) => {
			try {
				const newStreet = await streetModel.addStreet(args)
				if(newStreet) {
					return {
						status: 200,
						message: "Yangi ko'cha qo'shildi!",
						data: newStreet
					}
				} else throw new Error("Ko'chani qo'shishda muammolik yuz berdi!")
			} catch (error) { return mError(error) }
		},

		changeStreet: async (_, args) => {
			try {
				const updatedStreet = await streetModel.changeStreet(args)
				if(updatedStreet) {
					return {
						status: 200,
						message: "Ko'cha yangilandi!",
						data: updatedStreet
					}
				} else throw new Error("Bunday ko'cha mavjud emas!")
			} catch (error) { return mError(error) }
		},
	},

	Query: {
		streets: async (_, args) => {
			try {
				const streets = await streetModel.streets(args)
				return streets
			} catch(error) {
				throw error
			}
		}
	},

	Street: {
		streetId:        global  	   =>  global.street_id,
		streetName:      global  	   =>  global.street_name,
		streetDistance:  global  	   =>  global.street_distance,
		streetCreatedAt: global  	   =>  global.street_created_at,
		areas:           async global  =>  await streetModel.areas({ streetId: global.street_id }),
		region:          async global  =>  await streetModel.region({ streetId: global.street_id }),
		neighborhoods:   async global  =>  await streetModel.neighborhoods({ streetId: global.street_id })
	},
}
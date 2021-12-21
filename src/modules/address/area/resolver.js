import areaModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addArea: async (_, args) => {
			try {
				const newArea = await areaModel.addArea(args)
				if(newArea) {
					return {
						status: 200,
						message: "Yangi hudud qo'shildi!",
						data: newArea
					}
				} else throw new Error("Hudud qo'shishda muammolik yuz berdi!")
			} catch (error) { return mError(error) }
		},

		changeArea: async (_, args) => {
			try {
				const updatedArea = await areaModel.changeArea(args)
				if(updatedArea) {
					return {
						status: 200,
						message: "Hudud yangilandi!",
						data: updatedArea
					}
				} else throw new Error("Bunday hudu mavjud emas!")
			} catch (error) { return mError(error) }
		},
	},

	Query: {
		areas: async (_, args) => {
			try {
				const areas = await areaModel.areas(args)
				return areas
			} catch(error) {
				throw error
			}
		}
	},

	Area: {
		areaId:        global  	   		=>  global.area_id,
		areaName:      global  	   		=>  global.area_name,
		areaDistance:  global  	   		=>  global.area_distance,
		areaCreatedAt: global  	   		=>  global.area_created_at,
		streets:       async global  	=>  await areaModel.streets({ areaId: global.area_id }),
		neighborhood:  async global  	=>  await areaModel.neighborhood({ areaId: global.area_id })
	},
}
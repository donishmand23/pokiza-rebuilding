import { BadRequestError, InternalServerError } from '#errors'
import regionModel from './model.js'

export default {
	Mutation: {
		addRegion: async (_,arg) => {
			try {
				const newRegion = await regionModel.addRegion(arg)
				if(newRegion) {
					return {
						status: 200,
						message: "Yangi tuman qo'shildi!",
						data: newRegion
					}
				} else throw new InternalServerError("Tuman qo'shishda muammolik yuz berdi!")
			} catch (error) { 
				throw error
			 }
		},

		changeRegion: async (_,arg) => {
			try {
				const updatedRegion = await regionModel.changeRegion(arg)
				if(updatedRegion) {
					return {
						status: 200,
						message: "Tuman yangilandi!",
						data: updatedRegion
					}
				} else throw new BadRequestError("Bunday tuman mavjud emas!")
			} catch (error) { 
				throw error
			 }
		},
	},

	Query: {
		regions: async (_, args) => {
			try {
				const regions = await regionModel.regions(args)
				return regions
			} catch(error) {
				throw error
			}
		}
	},
	
	Region: {
		regionId:        global  	   =>  global.region_id,
		regionName:      global  	   =>  global.region_name,
		regionCreatedAt: global  	   =>  global.region_created_at,
		neighborhoods:   async global  =>  await regionModel.neighborhoods({ regionId: global.region_id }),
		branch:          async global  =>  await regionModel.branch({ branchId: global.branch_id }),
		state:           async global  =>  await regionModel.state({ stateId: global.state_id }),
	},
}
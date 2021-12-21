import neighborhoodModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addNeighborhood: async (_, args) => {
			try {
				const newNeighborhood = await neighborhoodModel.addNeighborhood(args)
				if(newNeighborhood) {
					return {
						status: 200,
						message: "Yangi mahalla qo'shildi!",
						data: newNeighborhood
					}
				} else throw new Error("Mahalla qo'shishda muammolik yuz berdi!")
			} catch (error) { return mError(error) }
		},

		changeNeighborhood: async (_, args) => {
			try {
				const updatedNeighborhood = await neighborhoodModel.changeNeighborhood(args)
				if(updatedNeighborhood) {
					return {
						status: 200,
						message: "Mahalla yangilandi!",
						data: updatedNeighborhood
					}
				} else throw new Error("Bunday mahalla mavjud emas!")
			} catch (error) { return mError(error) }
		},
	},

	Query: {
		neighborhoods: async (_,args) => {
			try {
				const neighborhoods = await neighborhoodModel.neighborhoods(args)
				return neighborhoods
			} catch(error) {
				throw error
			}
		}
	},

	Neighborhood: {
		neighborhoodId:        global 		=>  global.neighborhood_id,
		neighborhoodName:      global 		=>  global.neighborhood_name,
		neighborhoodDistance:  global 		=>  global.neighborhood_distance,
		neighborhoodCreatedAt: global 		=>  global.neighborhood_created_at,
		streets:               async global =>  await neighborhoodModel.streets({ neighborhoodId: global.neighborhood_id }),
		region:                async global =>  await neighborhoodModel.region({ regionId: global.region_id })
	},
}
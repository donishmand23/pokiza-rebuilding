import socialSetModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addSocialSet: async (_,arg) => {
			try {
				const newSocialSet = await socialSetModel.addSocialSet(arg)
				if(newSocialSet) {
					return {
						status: 200,
						message: "Yangi ijtimoy tarmoq qo'shildi!",
						data: newSocialSet
					}
				} else throw new Error("Ijtimoiy tarmoqni qo'shishda muammolik yuz berdi!")
			} catch (error) { return mError(error) }
		},

		changeSocialSet: async (_,arg) => {
			try {
				const updatedSocialSet = await socialSetModel.changeSocialSet(arg)
				if(updatedSocialSet) {
					return {
						status: 200,
						message: "Ijtimoy tarmoq yangilandi!",
						data: updatedSocialSet
					}
				} else throw new Error("Bunday ijtimoy tarmoq mavjud emas!")
			} catch (error) { return mError(error) }
		},
	},

	Query: {
		socialSets: async (_, args) => {
			try {
				const socicalSets = await socialSetModel.socialSets(args)
				return socicalSets
			} catch(error) {
				throw error
			}
		}
	},
	
	SocialSet: {
		socialSetId:        global =>  global.social_set_id,
		socialSetName:      global =>  global.social_set_name,
		socialSetIcon:      global =>  global.social_set_icon,
		socialSetCreatedAt: global =>  global.social_set_created_at,
	},
}
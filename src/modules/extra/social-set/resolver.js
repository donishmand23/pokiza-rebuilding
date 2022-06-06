import { BadRequestError, InternalServerError } from '#errors'
import socialSetModel from './model.js'

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
				} else throw new InternalServerError("Ijtimoiy tarmoqni qo'shishda muammolik yuz berdi!")
			} catch (error) { 
				throw error
			 }
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
				} else throw new BadRequestError("Bunday ijtimoy tarmoq mavjud emas!")
			} catch (error) { 
				throw error
			 }
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
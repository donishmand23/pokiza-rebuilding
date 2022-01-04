import searchModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Query: {
		searchGlobal: async (_, args) => {
			try {
				const data = await searchModel.searchGlobal(args)
				return data
			} catch(error) {
				throw error
			}
		}
	},

	GlobalSearch: {
		__resolveType (obj, context, info) {
			if(obj.client_id && obj.client_status && obj.client_created_at) {
				return 'Client'
			}
			if(obj.staff_id && obj.staff_created_at) {
				return 'Staff'
			}
		}
	}
}
import searchModel from './model.js'

export default {
	Query: {
		searchGlobal: async (_, args, user) => {
			try {
				const data = await searchModel.searchGlobal(args, user)
				return data
			} catch(error) {
				throw error
			}
		}
	},

	GlobalSearch: {
		__resolveType (obj) {
			if(obj.client_id && obj.client_status && obj.client_created_at) {
				return 'Client'
			}
			if(obj.staff_id && obj.staff_created_at) {
				return 'Staff'
			}
			if(obj.order_id && obj.order_created_at) {
				return 'Order'
			}
			if(obj.product_id && obj.product_created_at) {
				return 'Product'
			}
			if(obj.transport_id && obj.transport_created_at) {
				return 'Transport'
			}
		}
	}
}
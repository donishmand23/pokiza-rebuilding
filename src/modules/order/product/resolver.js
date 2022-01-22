import productModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Query: {
		products: async (_, args, { clientId }) => {
			try {
				const products = await productModel.products({ isDeleted: false, ...args }, { clientId })
				return products
			} catch(error) {
				console.log(error)
				throw error
			}
		},
	},

	Product: {
		productId:            global => global.product_id,
		productSize:          global => global.product_size,
		productPrice:         global => global.product_price,
		productSummary:       global => global.product_summary,
		productSpecial:       global => global.order_special,
		productSizeDetails:   global => global.product_size_details,
		productImg:           global => global.product_img && '/data/uploads/' + global.product_img,
		productStatusProcess: global => productModel.productStatuses({ productId: global.product_id }),
		service:              global => productModel.service({ serviceId: global.service_id }),
		order:                global => productModel.order({ orderId: global.order_id }),
		productStatus:  async global => {
			const statuses = await productModel.productStatuses({ productId: global.product_id })
			return statuses[statuses.length - 1]
		},
	}
}
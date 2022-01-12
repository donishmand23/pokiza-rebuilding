import orderModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addOrder: async (_, args, { clientId, staffId }) => {
			try {
				const newOrder = await orderModel.addOrder(args, { clientId, staffId })
				if(newOrder) {
					return {
						status: 200,
						message: "Buyurtma qabul qilindi!",
						data: newOrder
					}
				} else throw new Error("Buyurtmani qabul qilishda muammolik yuz berdi!")  
			} catch(error) { return mError(error) }
		},
	},

	Query: {
		orders: async (_, args) => {
			try {
				const orders = await orderModel.orders({ isDeleted: false, ...args })
				return orders
			} catch(error) {
				throw error
			}
		},
	},
	
	Order: {
		orderId:        	   global => global.order_id,
		special:        	   global => global.order_special,
		summary:        	   global => global.order_summary,
		bringTime:      	   global => global.order_bring_time,
		brougthTime:    	   global => global.order_brougth_time,
		deliveryTime:   	   global => global.order_delivery_time,
		deliveredTime:  	   global => global.order_delivery_time,
		orderCreatedAt: 	   global => global.order_created_at,
		bringTimeRemaining:    global => global.bring_time_remaining && global.bring_time_remaining | 0,
		deliveryTimeRemaining: global => global.delivery_time_remaining && global.delivery_time_remaining | 0,
		client:         	   global => orderModel.client({ clientId: global.client_id }),
		branch:         	   global => orderModel.branch({ branchId: global.branch_id }),
		address:        	   global => orderModel.address({ addressId: global.address_id }),
		statusProcess:  	   global => orderModel.orderStatuses({ orderId: global.order_id }),
		status:          async global => {
			const statuses = await orderModel.orderStatuses({ orderId: global.order_id })
			return statuses[statuses.length - 1]
		},
	}
}
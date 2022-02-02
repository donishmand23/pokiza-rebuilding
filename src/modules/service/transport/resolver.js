import transportModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		bindOrder: async (_, args, context) => {
			try {
				const boundOrders = await transportModel.bindOrder(args, context)
				if(boundOrders.length) {
					return {
						status: 200,
						message: "Buyurtma va buyumlar mashinaga biriktirildi!",
						data: []
					}
				} else throw new Error("Xatolik yuz berdi!")
			} catch (error) {
				if(error.message.includes('order_bindings_product_id_key')) {
					return mError("Buyurtma yoki buyum allaqachon mashinaga biriktirilgan!")
				}
				return mError(error)
			}
		},

		unbindOrder: async (_, args, context) => {
			try {
				const unboundOrders = await transportModel.unbindOrder(args, context)
				console.log(unboundOrders)
				if(unboundOrders.length) {
					return {
						status: 200,
						message: "Buyurtma va buyumlar mashinadan chiqarildi!",
						data: []
					}
				} else throw new Error("Buyurtma va buyumlar allaqachon mashinadan chiqarilgan!")
			} catch (error) { return mError(error) }
		},
	},

	Query: {
		transports: async (_, args) => {
			try {
				const transports = await transportModel.transports({ isDeleted: false, ...args })
				return transports
			} catch(error) {
				throw error
			}
		}
	},
	
	Transport: {
		count:              global => global.full_count, 
		transportId:        global => global.transport_id,
		transportModel:     global => global.transport_model, 
		transportColor:     global => global.transport_color, 
		transportNumber:    global => global.transport_number, 
		transportBroken:    global => global.transport_broken, 
		transportSummary:   global => global.transport_summary,		
		transportCreatedAt: global => global.transport_created_at, 
		transportImg:       global => '/data/uploads/' + global.transport_img || 'avto.jpg',
		branch:             global => transportModel.branch({ branchId: global.branch_id }),
		driversList:        global => transportModel.drivers({ transportId: global.transport_id }),
		driver:       async global => {
			const drivers = await transportModel.drivers({ transportId: global.transport_id })
			return drivers.at(-1)
		},
	},

	Driver: {
		registeredAt:   global => global.registered_at,
		unRegisteredAt: global => global.unregistered_at,
		staff:          global => transportModel.staff({ staffId: global.staff_id }),
	}
}
import transportModel from './model.js'
import upload from '#helpers/upload'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addTransport: async (_, args) => {
			try {
				await upload(args)
				const newTransport = await transportModel.addTransport(args)
				if(newTransport) {
					return {
						status: 200,
						message: "Yangi transport qo'shildi!",
						data: newTransport
					}
				} else throw new Error("Transport qo'shishda muammolik yuz berdi!")
			} catch (error) { return mError(error) }
		},

		changeTransport: async (_, args) => {
			try {
				await upload(args)
				const updatedTransport = await transportModel.changeTransport(args)
				if(updatedTransport) {
					return {
						status: 200,
						message: "Transport ma'lumotlari yangilandi!",
						data: updatedTransport
					}
				} else throw new Error("Bunday transport mavjud emas!")
			} catch (error) { return mError(error) }
		},

		deleteTransport: async (_, args) => {
			try {
				const deletedTransports = await transportModel.deleteTransport(args)
				if(deletedTransports.length) {
					return {
						status: 200,
						message: "Transportlar o'chirildi. Ularni qayta tiklash mumkin.",
						data: deletedTransports
					}
				} else throw new Error("Bunday transportlar mavjud emas!")
			} catch (error) { return mError(error) }
		},

		restoreTransport: async (_, args) => {
			try {
				const restoredTransports = await transportModel.restoreTransport(args)
				if(restoredTransports.length) {
					return {
						status: 200,
						message: "Transportlar qayta tiklandi!",
						data: restoredTransports
					}
				} else throw new Error("Bunday transportlar mavjud emas!")
			} catch (error) { return mError(error) }
		},

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
		},

		deletedTransports: async (_, args) => {
			try {
				const transports = await transportModel.transports({ isDeleted: true, ...args })
				return transports
			} catch(error) {
				throw error
			}
		},
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
		transportImg:       global => '/data/uploads/' + (global.transport_img || 'avto.jpg'),
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
import { BadRequestError, InternalServerError } from '#errors'
import transportModel from './model.js'
import upload from '#helpers/upload'

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
				} else throw new InternalServerError("Transport qo'shishda muammolik yuz berdi!")
			} catch (error) { 
				throw error
			 }
		},

		changeTransport: async (_, args, user) => {
			try {
				await upload(args)
				const updatedTransport = await transportModel.changeTransport(args, user)
				if(updatedTransport) {
					return {
						status: 200,
						message: "Transport ma'lumotlari yangilandi!",
						data: updatedTransport
					}
				} else throw new BadRequestError("Bunday transport mavjud emas!")
			} catch (error) { 
				throw error
			 }
		},

		deleteTransport: async (_, args, user) => {
			try {
				const deletedTransports = await transportModel.deleteTransport(args, user)
				if(deletedTransports.length) {
					return {
						status: 200,
						message: "Transportlar o'chirildi. Ularni qayta tiklash mumkin.",
						data: deletedTransports
					}
				} else throw new BadRequestError("Bunday transportlar mavjud emas!")
			} catch (error) { 
				throw error
			 }
		},

		restoreTransport: async (_, args, user) => {
			try {
				const restoredTransports = await transportModel.restoreTransport(args, user)
				if(restoredTransports.length) {
					return {
						status: 200,
						message: "Transportlar qayta tiklandi!",
						data: restoredTransports
					}
				} else throw new BadrequestError("Bunday transportlar mavjud emas!")
			} catch (error) { 
				throw error
			 }
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
				} else throw new InternalServerError("Xatolik yuz berdi!")
			} catch (error) {
				if(error.message.includes('unique')) {
					throw new BadRequestError("Buyurtma yoki buyum allaqachon mashinaga biriktirilgan!")
				}
				throw error
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
				} else throw new BadRequestError("Buyurtma va buyumlar allaqachon mashinadan chiqarilgan!")
			} catch (error) { 
				throw error
			 }
		},

		registerTransport: async (_, args, user) => {
			try {
				const registeredTransport = await transportModel.registerTransport(args, user)
				if (registeredTransport) {
					return {
						status: 200,
						message: "Transport haydovchiga registratsiya qilindi!",
						data: null
					}
				} else throw new BadRequestError("Bunday transport yoki haydovchi mavjud emas!")
			} catch (error) { 
				throw error
			 }
		},

		unregisterTransport: async (_, args, user) => {
			try {
				const unregisteredTransport = await transportModel.unregisterTransport(args, user)
				console.log(unregisteredTransport)
				if (unregisteredTransport) {
					return {
						status: 200,
						message: "Transport registratsiyadan chiqarildi!",
						data: null
					}
				} else throw new BadRequestError("Bunday transport mavjud emas yoki u allaqachon bo'sh!")
			} catch (error) { 
				throw error
			 }
		},
	},

	Query: {
		transports: async (_, args, user) => {
			try {
				const transports = await transportModel.transports(args, user)
				return transports
			} catch(error) {
				throw error
			}
		},
	},
	
	Transport: {
		count:                global => global.full_count, 
		ordersCount:          global => global.orders_count, 
		productsCount:        global => global.products_count, 
		bringingOrdersCount:     global => global.bringing_orders_count, 
		deliveringOrdersCount:   global => global.delivering_orders_count, 
		bringingProductsCount:   global => global.bringing_products_count, 
		deliveringProductsCount: global => global.delivering_products_count, 
		transportId:          global => global.transport_id,
		transportModel:       global => global.transport_model, 
		transportColor:       global => global.transport_color, 
		transportNumber:      global => global.transport_number, 
		transportBroken:      global => global.transport_broken, 
		transportSummary:     global => global.transport_summary,		
		transportCreatedAt:   global => global.transport_created_at, 
		transportDeletedAt:   global => global.transport_deleted_at, 
		transportRegistered:  global => global.transport_registered,
		transportOrderLoaded: global => global.transport_order_loaded,
		transportImg:         global => '/data/uploads/' + (global.transport_img || 'avto.jpg'),
		branch:               global => transportModel.branch({ branchId: global.branch_id }),
		driversList:          global => transportModel.drivers({ transportId: global.transport_id }),
		driver:       async   global => {
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
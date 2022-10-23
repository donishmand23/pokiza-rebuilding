import { BadRequestError, InternalServerError } from '#errors'
import serviceModel from './model.js'

export default {
	Mutation: {
		addService: async (_, arg, user) => {
			try {
				const newService = await serviceModel.addService(arg, user)
				if(newService) {
					return {
						status: 200,
						message: "Yangi xizmat turi qo'shildi!",
						data: newService
					}
				} else throw new InternalServerError("Yangi xizmat turini qo'shishda muammolik yuz berdi!")
			} catch (error) { 
				if(error.message.includes("duplicate key value")) {
					throw new BadRequestError("Bu filialda bunday xizmat turi allaqachon bor!")
				}
				throw error
			}
		},

		changeService: async (_, arg, user) => {
			try {
				const updatedService = await serviceModel.changeService(arg, user)
				if(updatedService) {
					return {
						status: 200,
						message: "Xizmat turi yangilandi!",
						data: updatedService
					}
				} else throw new BadRequestError("Bunday xizmat turi mavjud emas yoki xizmatda hech qanday yangi o'zgarish yo'q!")
			} catch (error) {
				if(error.message.includes("duplicate key value")) {
					throw new BadRequestError("Bu filialda bunday xizmat turi allaqachon bor!")
				}
				throw error
			}
		},

		disableService: async (_, arg, user) => {
			try {
				const disabledServices = await serviceModel.disableService(arg, user)
				if(disabledServices.length) {
					return {
						status: 200,
						message: "Xizmat tur(lar)i o'chirildi. U(lar)ni qayta tiklash mumkin!",
						data: disabledServices
					}
				} else throw new BadRequestError("Bunday xizmat turi(lar)i mavjud emas!")
			} catch (error) { 
				throw error
			 }
		},

		enableService: async (_, arg, user) => {
			try {
				const enabledServices = await serviceModel.enableService(arg, user)
				if(enabledServices.length) {
					return {
						status: 200,
						message: "Xizmat tur(lar)i yoqildi!",
						data: enabledServices
					}
				} else throw new BadRequestError("Bunday xizmat tur(lar)i mavjud emas!")
			} catch (error) { 
				throw error
			 }
		},

		changeDeliveryHour: async (_, arg, user) => {
			try {
				const updatedDeliveryHour = await serviceModel.changeDeliveryHour(arg, user)
				if(updatedDeliveryHour) {
					return {
						status: 200,
						message: "Taxminiy yetkazib berish vaqti yangilandi!",
						data: updatedDeliveryHour
					}
				} else throw new BadRequestError("Bunday ID mavjud emas!")
			} catch (error) { 
				throw error
			 }
		},
	},

	Query: {
		services: async (_, args, user) => {
			try {
				const services = await serviceModel.services(args, user)
				return services
			} catch(error) {
				throw error
			}
		},

		deliveryHours: async (_, args) => {
			try {
				const deliveryHours = await serviceModel.deliveryHours(args)
				return deliveryHours
			} catch(error) {
				throw error
			}
		},
	},
	
	Service: {
		serviceId:   		 global => global.service_id,
		serviceName: 		 global => global.service_name,
		serviceUnit: 		 global => global.service_unit,
		serviceUnitKeys:     global => global.service_unit_keys,
		servicePriceSpecial: global => global.service_price_special,
		servicePriceSimple:  global => global.service_price_simple,
		serviceCreatedAt:    global => global.service_created_at,
		serviceDeletedAt:    global => global.service_deleted_at,
		branch:              global => serviceModel.branch({ branchId: global.branch_id }),
	},

	DeliveryHour: {
		deliveryHourId:        global => global.delivery_hour_id,
		deliveryHourSpecial:   global => global.delivery_hour_special,
		deliveryHourSimple:    global => global.delivery_hour_simple,
		deliveryHourCreatedAt: global => global.delivery_hour_created_at,
		branch:                global => serviceModel.branch({ branchId: global.branch_id }),
	}
}
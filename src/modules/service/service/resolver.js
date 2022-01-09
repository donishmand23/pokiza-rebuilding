import serviceModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addService: async (_, arg) => {
			try {
				const newService = await serviceModel.addService(arg)
				if(newService) {
					return {
						status: 200,
						message: "Yangi xizmat turi qo'shildi!",
						data: newService
					}
				} else throw new Error("Yangi xizmat turini qo'shishda muammolik yuz berdi!")
			} catch (error) { 
				if(error.message.includes("duplicate key value")) {
					return mError("Bu filialda bunday xizmat turi allaqachon bor!")
				} else return mError(error)
			}
		},

		changeService: async (_, arg) => {
			try {
				const updatedService = await serviceModel.changeService(arg)
				if(updatedService) {
					return {
						status: 200,
						message: "Xizmat turi yangilandi!",
						data: updatedService
					}
				} else throw new Error("Bunday xizmat turi mavjud emas yoki xizmatda hech qanday yangi o'zgarish yo'q!")
			} catch (error) {
				if(error.message.includes("duplicate key value")) {
					return mError("Bu filialda bunday xizmat turi allaqachon bor!")
				} else return mError(error)
			}
		},

		disableService: async (_, arg) => {
			try {
				const disabledServices = await serviceModel.disableService(arg)
				if(disabledServices.length) {
					return {
						status: 200,
						message: "Xizmat tur(lar)i o'chirildi. U(lar)ni qayta tiklash mumkin!",
						data: disabledServices
					}
				} else throw new Error("Bunday xizmat turi(lar)i mavjud emas!")
			} catch (error) { return mError(error) }
		},

		enableService: async (_, arg) => {
			try {
				const enabledServices = await serviceModel.enableService(arg)
				if(enabledServices.length) {
					return {
						status: 200,
						message: "Xizmat tur(lar)i yoqildi!",
						data: enabledServices
					}
				} else throw new Error("Bunday xizmat tur(lar)i mavjud emas!")
			} catch (error) { return mError(error) }
		},

		changeDeliveryHour: async (_, arg) => {
			try {
				const updatedDeliveryHour = await serviceModel.changeDeliveryHour(arg)
				if(updatedDeliveryHour) {
					return {
						status: 200,
						message: "Taxminiy yetkazib berish vaqti yangilandi!",
						data: updatedDeliveryHour
					}
				} else throw new Error("Bunday ID mavjud emas!")
			} catch (error) { return mError(error) }
		},
	},

	Query: {
		services: async (_, args) => {
			try {
				const services = await serviceModel.services({ isDeleted: false, ...args })
				return services
			} catch(error) {
				throw error
			}
		},

		disabledServices: async (_, args) => {
			try {
				const disabledServices = await serviceModel.services({ isDeleted: true, ...args })
				return disabledServices
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
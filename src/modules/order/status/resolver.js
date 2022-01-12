import statusModel from './model.js'
import { mError } from '#helpers/error'

const orderStatusInfo = {
	1: {
		code: 1,
		name: 'moderator',
		description: "Mijoz o'z appidan buyurtma bergan vaqt o'tadigan birinchi buyurtma statusi"
	},
	2: {
		code: 2,
		name: 'kutilmoqda',
		description: "Xodim moderator statusidagi buyurtmani tasdiqlagan paytdagi buyurtma statusi"
	},
	3: {
		code: 3,
		name: 'biriktirilgan',
		description: "Xodim kutilmoqda statusidagi buyurtmani olib kelish uchun mashinaga biriktirgan paytdagi buyurtma statusi"
	},
	4: {
		code: 4,
		name: 'haydovchida',
		description: "Haydovchi biriktirilgan statusli buyurtma ichiga mijozdan qabul qilib olgan buyumlarni birinchi marta kiritib, mashinaga yuklagan paytdagi buyurtma statusi"
	},
	5: {
		code: 5,
		name: 'jarayonda',
		description: "Buyumlari 'yetib kelgan', 'yuvilishda', 'quritishda', 'qadoqlashda', 'omborda' statuslaridan birida bo'lgan paytdagi buyurtma statusi"
	},
	6: {
		code: 6,
		name: 'tayyor',
		description: "Buyumlarining barchasi 'tayyor' bo'lgan paytdagi buyurtma statusi"
	},
	7: {
		code: 7,
		name: 'yuklangan',
		description: "Tayyor statusidagi buyurtmani yetkazib berish uchun mashinaga biriktirilgan paytdagi buyurtma statusi"
	},
	8: {
		code: 8,
		name: 'yetkazib berishda',
		description: "Yetkazib berish uchun mashinaga biriktirilgan buyurtmani, mashinaga har bir buyumi bilan yuklangan paytdagi buyurtma statusi"
	},
	9: {
		code: 9,
		name: 'yetkazildi',
		description: "Buyurtma har bir buyumi bilan to'liq mijozga yetkazib berilgan paytdagi buyurtma statusi"
	},
	10:{
		code: 10,
		name: 'qisman yetkazildi',
		description: "Buyurtma yetkazib berilganda, ichidagi bazi buyumlari qaytarib yuborilgan paytdagi buyurtma statusi"
	},
}

export default {
	Query: {
		orderStatusInfo: async (_, args) => {
			try {
				return Object.keys(orderStatusInfo).map((statusKey) => {
					return {
						statusCode: +statusKey,
						statusName: orderStatusInfo[statusKey]['name'],
						statusDescription: orderStatusInfo[statusKey]['description']
					}
				})
			} catch(error) {
				throw error
			}
		},
	},

	OrderStatus: {
		statusCode:       global => global.order_status_code,
		statusChangeTime: global => global.order_status_created_at,
		staff:            global => statusModel.staff({ staffId: global.staff_id }),
		statusInfo: global => {
			return {
				statusCode: orderStatusInfo[global.order_status_code]['code'],
				statusName: orderStatusInfo[global.order_status_code]['name'],
				statusDescription: orderStatusInfo[global.order_status_code]['description'],
			}
		},
	}
}
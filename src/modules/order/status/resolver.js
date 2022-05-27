import statusModel from './model.js'

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

const productStatusInfo = {
	1: {
		code: 1,
		name: 'Haydovchida',
		description: 'Haydovchi mijoz uyida buyumni har birini qabul qilib olgan paytdagi buyum statusi'
	},
	2: {
		code: 2,
		name: 'Yetib keldi',
		description: 'Haydovchi fabrikaga olib kelgan buyumlarini mashinadan tushirgan paytdagi buyum statusi'
	},
	3: {
		code: 3,
		name: 'Yuvilishda',
		description: 'Yuvilish jarayonida bo\'lgan buyum statusi'
	},
	4: {
		code: 4,
		name: 'Quritishda',
		description: 'Quritish jarayonida bo\'lgan buyum statusi'
	},
	5: {
		code: 5,
		name: 'Qadoqlashda',
		description: 'Qadoqlash jarayonida bo\'lgan buyum statusi'
	},
	6: {
		code: 6,
		name: 'Omborda',
		description: 'Omborda bo\'lgan buyum statusi'
	},
	7: {
		code: 7,
		name: 'Tayyor',
		description: 'Yetkazib berishga tayyor bo\'lgan buyum statusi'
	},
	8: {
		code: 8,
		name: 'Yuklangan',
		description: 'Yetkazib berish uchun mashinaga biriktirilgan buyum statusi'
	},
	9: {
		code: 9,
		name: 'Yetkazib berishda',
		description: 'Mijozning uyiga yetkazib berish jarayonida bo\'lgan buyum statusi'
	},
	10: {
		code: 10,
		name: 'Yetkazildi',
		description: 'Mijozga to\'liq yetkazib berilgan buyum statusi'
	}
}

process.PRODUCT_STATUSES = productStatusInfo
process.ORDER_STATUSES = orderStatusInfo

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

		productStatusInfo: async (_, args) => {
			try {
				return Object.keys(productStatusInfo).map((statusKey) => {
					return {
						statusCode: +statusKey,
						statusName: productStatusInfo[statusKey]['name'],
						statusDescription: productStatusInfo[statusKey]['description']
					}
				})
			} catch(error) {
				throw error
			}
		},
	},

	Status: {
		statusCode:       global => global.status_code,
		statusChangeTime: global => global.status_created_at,
		staff:            global => statusModel.staff({ staffId: global.staff_id }),
		statusInfo: global => {
			if(global.order_status_id) {
				return {
					statusCode: global.status_code,
					statusName: orderStatusInfo[global.status_code]['name'],
					statusDescription: orderStatusInfo[global.status_code]['description'],
				}
			} else {
				return {
					statusCode: global.status_code,
					statusName: productStatusInfo[global.status_code]['name'],
					statusDescription: productStatusInfo[global.status_code]['description'],
				}
			}
		},
	}
}
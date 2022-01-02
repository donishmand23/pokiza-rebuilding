import clientModel from './model.js'
import codeGen from '#helpers/randomNumberGenerator'
import { sendPassword } from '#utils/sms'
import { mError } from '#helpers/error'
import { sign } from '#utils/jwt'


export default {
	Mutation: {
		addClient: async (_, args) => {
			try {
				const newClient = await clientModel.addClient(args)
				if(newClient) {
					return {
						status: 200,
						message: "Yangi mijoz qo'shildi!'",
						data: newClient
					}
				} else throw new Error("Mijoz qo'shishda muammolik yuz berdi!")
			} catch(error) { return mError(error) }
		},

		changeClient: async (_, args) => {
			try {
				const updatedClient = await clientModel.changeClient(args)
				if(updatedClient) {
					return {
						status: 200,
						message: "Mijoz ma'lumotlari yangilandi!'",
						data: updatedClient
					}
				} else throw new Error("Mijoz ma'lumotlarini yangilashda muammolik yuz berdi!")
			} catch(error) { return mError(error) }
		},

		deleteClient: async (_, args) => {
			try {
				const deletedClients = await clientModel.deleteClient(args)
				if(deletedClients.length) {
					return {
						status: 200,
						message: "Mijozlar o'chirildi! Agar ularning asosiy raqami band qilib olinmasa, ularni qayta tiklash mumkin.",
						data: deletedClients
					}
				} else throw new Error("Bunday mijozlar mavjud emas!")
			} catch(error) { return mError(error) }
		},

		restoreClient: async (_, args) => {
			try {
				const restoredClients = await clientModel.restoreClient(args)
				if(restoredClients.length) {
					return {
						status: 200,
						message: "Mijozlar qayta tiklandi!",
						data: restoredClients
					}
				} else throw new Error("Bunday o'chirilgan mijozlar mavjud emas!")
			} catch(error) { 
				if(error.message.includes("users_user_main_contact_key")) {
					return mError("Mijozni tiklashni imkoni yo'q. Chunki telefon raqam allaqachon boshqa akkountdan ro'yxatdan o'tkazilgan.")
				}
				return mError(error)
			}
		},

		// enterClientPhone: async (_, args, { agent }) => {
		// 	try {
		// 		const client = await clientModel.enterClientPhone(args)
		// 		if(client) {

		// 			const code = codeGen(4)
		// 			await sendPassword(args.mainContact, code)

		// 			return {
		// 				status: 200,
		// 				message: args.mainContact + " ga kod yuborildi. Kod 3 daqiqa amal qiladi." + code,
		// 				token: sign({ userId: client.user_id, agent }, 60 * 3)
		// 			}

		// 		} else throw new Error("Dasturda bunday telefon raqam mavjud emas!")
		// 	} catch(error) { return mError(error) }
		// },
	},

	Query: {
		clients: async (_, args) => {
			try {
				const clients = await clientModel.clients({ isDeleted: false, ...args })
				return clients
			} catch(error) {
				throw error
			}
		},

		deletedClients: async (_, args) => {
			try {
				const deletedClients = await clientModel.clients({ isDeleted: true, ...args })
				return deletedClients
			} catch(error) {
				throw error
			}
		},
	},
	
	Client: {
		clientId:        global => global.client_id,
		count:           global => global.full_count,
		clientStatus:    global => global.client_status,
		clientSummary:   global => global.client_summary,
		clientCreatedAt: global => global.client_created_at,
		clientInfo:      global => clientModel.user({ userId: global.user_id }),
		socialSet:       global => clientModel.socialSet({ socialSetId: global.social_set_id }),
	}
}
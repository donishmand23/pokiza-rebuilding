import clientModel from './model.js'
import { mError } from '#helpers/error'

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
	},

	Query: {
		clients: async (_, args) => {
			try {
				const clients = await clientModel.clients(args)
				return clients
			} catch(error) {
				throw error
			}
		}
	},
	
	Client: {
		clientId:        global => global.client_id,
		count:           global => global.full_count,
		clientStatus:    global => global.client_status,
		clientSummary:   global => global.client_summary,
		clientCreatedAt: global => global.client_created_at,
		socialSet:       global => clientModel.socialSet({ socialSetId: global.social_set_id }),
		clientInfo:      global => {
			if(global.user) return global.user
			else return clientModel.user({ userId: global.user_id })
		},
	}
}
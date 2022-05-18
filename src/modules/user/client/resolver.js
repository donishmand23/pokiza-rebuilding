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

		changeClient: async (_, args, { clientId, staffId, userId }) => {
			try {
				const updatedClient = await clientModel.changeClient(args, { clientId, staffId, userId })
				if(updatedClient) {
					return {
						status: 200,
						message: "Mijoz ma'lumotlari yangilandi!'",
						data: updatedClient
					}
				} else throw new Error("Mijoz ma'lumotlarini yangilashda muammolik yuz berdi!")
			} catch(error) { return mError(error) }
		},


		deleteClient: async (_, args, { clientId, userId }) => {
			try {
				const deletedClients = await clientModel.deleteClient(args, { clientId, userId })
				if(deletedClients.length) {
					return {
						status: 200,
						message: "Mijozlar o'chirildi! Agar ularning asosiy raqami band qilib olinmasa, ularni qayta tiklash mumkin.",
						data: deletedClients
					}
				} else throw new Error("Bunday mijozlar mavjud emas!")
			} catch(error) { return mError(error) }
		},

		restoreClient: async (_, args, { clientId, userId }) => {
			try {
				const restoredClients = await clientModel.restoreClient(args, { clientId, userId })
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

		enterClientPhone: async (_, args, { agent }) => {
			try {
				const code = codeGen(4)
				const client = await clientModel.enterClientPhone({ code, ...args })
				if(client) {
					// await sendPassword(args.mainContact, code)
					return {
						status: 200,
						registered: client.is_registered,
						message: args.mainContact + " ga kod yuborildi. Kod 3 daqiqa amal qiladi. " + code,
						token: sign({ 
							registered: client.is_registered, 
							userId: client.user_id, 
							agent 
						}, 60 * 3),
					}
				} else throw new Error("Muammolik yuz berdi!")
			} catch(error) {
				if(error.message.includes("users_user_main_contact_key")) {
					return mError("Bu telefon raqam xodim sifatida ro'yxatdan o'tkazilgan. Boshqa raqam kiriting!")
				}
				return mError(error)
			}
		},

		enterClientPassword: async (_, args, { userId, agent }) => {
			try {
				const code = codeGen(4)
				const client = await clientModel.enterClientPassword({ userId, code, ...args })
				if(client) {
					return {
						status: 200,
						data: client.is_registered ? client : null,
						registered: client.is_registered,
						message: "Kod to'g'ri kiritildi!",
						token: sign({
							userId: client.user_id, 
							clientId: client.client_id,
							registered: client.is_registered, 
							agent 
						}),
					}
				} else throw new Error("Muammolik yuz berdi!")
			} catch(error) { return mError(error) }
		},

		fillClientData: async (_, args, { clientId, agent }) => {
			try {
				const updatedClient = await clientModel.fillClientData({ clientId, ...args })
				if(updatedClient) {
					return {
						status: 200,
						registered: true,
						message: "Siz muvaffaqqiyatli ro'yxatdan o'tdingiz!'",
						data: updatedClient,
						token: sign({
							registered: true,
							clientId: updatedClient.client_id,
							user_id: updatedClient.user_id,
							agent
						})
					}
				} else throw new Error("Ro'yxatdan o'tishda muammolik yuz berdi!")
			} catch(error) { return mError(error) }
		},
	},

	Query: {
		clients: async (_, args, { clientId, allowedBranches }) => {
			try {
				const clients = await clientModel.clients({ isDeleted: false, ...args }, { clientId, allowedBranches })
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
		userInfo:        global => clientModel.user({ userId: global.user_id }),
		socialSet:       global => clientModel.socialSet({ socialSetId: global.social_set_id }),
	}
}
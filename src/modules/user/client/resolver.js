import clientModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addClient: async (_, args) => {
			try {
				const newClient = await clientModel.addClient(args)
				console.log(newClient)
				if(newClient) {
					return {
						status: 200,
						message: "Yangi mijoz qo'shildi!'",
						data: newClient
					}
				} else throw new Error("Mijoz qo'shishda muammolik yuz berdi!")
			} catch(error) { return mError(error) }
		}
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
		clientInfo:      global => clientModel.user({ userId: global.user_id }),
		clientFrom:      global => clientModel.socialSet({ socialSetId: global.social_set_id }),
	}
}
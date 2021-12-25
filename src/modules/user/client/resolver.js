import clientModel from './model.js'
import { mError } from '#helpers/error'

export default {
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
		clientStatus:    global => global.client_status,
		clientSummary:   global => global.client_summary,
		clientCreatedAt: global => global.client_created_at,
		clientFrom:      global => clientModel.socialSet({ socialSetId: global.social_set_id }),
		clientInfo:      global => clientModel.user({ userId: global.user_id })
	}
}
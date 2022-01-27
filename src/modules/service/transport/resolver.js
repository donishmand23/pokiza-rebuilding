import transportModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Query: {
		transports: async (_, args) => {
			try {
				const transports = await transportModel.transports({ isDeleted: false, ...args })
				return transports
			} catch(error) {
				throw error
			}
		}
	},
	
	Transport: {
		transportId:        global => global.transport_id,
		transportModel:     global => global.transport_model, 
		transportColor:     global => global.transport_color, 
		transportNumber:    global => global.transport_number, 
		transportBroken:    global => global.transport_broken, 
		transportSummary:   global => global.transport_summary,		
		transportCreatedAt: global => global.transport_created_at, 
		count:              global => global.full_count, 
		branch:             global => transportModel.branch({ branchId: global.branch_id }),
	}
}
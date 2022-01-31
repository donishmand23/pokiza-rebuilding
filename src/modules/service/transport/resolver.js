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
		count:              global => global.full_count, 
		transportId:        global => global.transport_id,
		transportModel:     global => global.transport_model, 
		transportColor:     global => global.transport_color, 
		transportNumber:    global => global.transport_number, 
		transportBroken:    global => global.transport_broken, 
		transportSummary:   global => global.transport_summary,		
		transportCreatedAt: global => global.transport_created_at, 
		transportImg:       global => '/data/uploads/' + global.transport_img || 'avto.jpg',
		branch:             global => transportModel.branch({ branchId: global.branch_id }),
		driversList:        global => transportModel.drivers({ transportId: global.transport_id }),
		driver:       async global => {
			const drivers = await transportModel.drivers({ transportId: global.transport_id })
			return drivers.at(-1)
		},
	},

	Driver: {
		registeredAt:   global => global.registered_at,
		unRegisteredAt: global => global.unregistered_at,
		staff:          global => transportModel.staff({ staffId: global.staff_id }),
	}
}

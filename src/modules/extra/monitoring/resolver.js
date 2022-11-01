import monitoringModel from './model.js'

const sections = {
	clients: ['branch', 'status', 'firstName', 'lastName', 'mainContact', 'secondContact', 'address', 'birthDate', 'gender', 'summary'],
	staffs: ['branch', 'file', 'firstName', 'lastName', 'mainContact', 'secondContact', 'address', 'birthDate', 'gender', 'summary'],
	transports: ['file', 'branch', 'name', 'color', 'status', 'number', 'summary', 'availability'],
	orders: ['status', 'address', 'branch', 'summary', 'bringTime', 'plan'],
	products: ['status', 'summary', 'service', 'file', 'size'],
	services: ['name', 'price', 'branch', 'unit', 'unitKeys'],
	settings: ['deliveryHours'],
	financeOrders: ['moneyAmount', 'summary'],
	financeDebts: ['moneyAmount', 'receiver', 'sender', 'status', 'dateTime', 'summary'],
	financeExpanses: ['expanse', 'moneyAmount', 'receiver', 'sender', 'status', 'dateTime', 'summary'],
	financeFonds: ['moneyAmount', 'receiver', 'sender', 'status', 'dateTime', 'summary'],
	financeMoneys: ['moneyAmount', 'receiver', 'sender', 'status', 'dateTime', 'summary'],
}

export default {
	Query: {
		monitoring: async (_, args, user) => {
			try {
				const { page, limit } = args.pagination

				let monitoring = await monitoringModel.monitoring(args, user)
				let count = monitoring.length

				monitoring = monitoring.map(el => {
					el.count = count
					
					if(el.section_name == 'products' && el.section_field == 'status') {
						el.old_value = process.PRODUCT_STATUSES[el.old_value]?.code
						el.new_value = process.PRODUCT_STATUSES[el.new_value]?.code
						return el
					}

					if(el.section_name == 'orders' && el.section_field == 'status') {
						el.old_value = process.ORDER_STATUSES[el.old_value]?.code
						el.new_value = process.ORDER_STATUSES[el.new_value]?.code
						return el
					}

					if((['birthDate', 'bringTime', 'dateTime']).includes(el.section_field)) {
						const oldDate = new Date(el.old_value)
						const newDate = new Date(el.new_value)

						const oldD = oldDate.toISOString().split('T')[0]
						const newD = newDate.toISOString().split('T')[0]

						const oldT = oldDate.toTimeString().split(' ')[0]
						const newT = newDate.toTimeString().split(' ')[0]

						el.old_value = oldD + ' ' + oldT
						el.new_value = newD + ' ' + newT
						return el
					}

					if(el.section_field == 'gender') {
						el.old_value = el.old_value == 1 ? 'erkak' : el.old_value == 2 ? 'ayol' : el.old_value
						el.new_value = el.new_value == 1 ? 'erkak' : el.new_value == 2 ? 'ayol' : el.new_value
						return el
					}

					return el
				}).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

				monitoring = monitoring.slice((page - 1) * limit, page * limit)

				return monitoring
			} catch(error) {
				throw error
			}
		},

		monitoringSections: async (_, args) => {
			try {
				return Object.keys(sections).map(key => {
					return {
						sectionName: key,
						sectionFields: sections[key]
					}
				})
			} catch(error) {
				throw error
			}
		},
	},

	Monitoring: {
		oldValue:      global => global.old_value,
		newValue:      global => global.new_value,
		operationType: global => global.operation_type,
		sectionName:   global => global.section_name,
		sectionId:     global => global.section_id,
		sectionField:  global => global.section_field,
		createdAt:     global => global.created_at,
		branch:        global => monitoringModel.branch({ branchId: global.branch_id }),
		user: async global => {
			const { client, staff } = await monitoringModel.user({ userId: global.user_id })
			return client || staff
		},
	}
}
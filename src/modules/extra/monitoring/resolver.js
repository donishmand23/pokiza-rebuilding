import monitoringModel from './model.js'
import { mError } from '#helpers/error'

const sections = {
	clients: ['branch', 'status', 'firstName', 'lastName', 'mainContact', 'secondContact', 'address', 'birthDate', 'gender', 'summary'],
	staffs: ['branch', 'file', 'firstName', 'lastName', 'mainContact', 'secondContact', 'address', 'birthDate', 'gender', 'summary'],
	transports: ['file', 'branch', 'name', 'color', 'status', 'number', 'summary'],
	orders: ['status', 'address', 'branch', 'summary', 'bringTime', 'plan'],
	products: ['status', 'summary', 'service', 'file', 'size'],
	services: ['name', 'price', 'branch', 'unit', 'unitKeys'],
	settings: ['deliveryHours'],
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
						el.old_value = 'value: ' + process.PRODUCT_STATUSES[el.old_value]?.code
						el.new_value = 'value: ' + process.PRODUCT_STATUSES[el.new_value]?.code
						return el
					}

					if(el.section_name == 'orders' && el.section_field == 'status') {
						el.old_value = 'value: ' + process.ORDER_STATUSES[el.old_value]?.code
						el.new_value = 'value: ' + process.ORDER_STATUSES[el.new_value]?.code
						return el
					}

					if((['birthDate', 'bringTime']).includes(el.section_field)) {
						let [, oldDate] = el.old_value.split('value: ')
						let [, newDate] = el.new_value.split('value: ')
						oldDate = new Date(oldDate)
						newDate = new Date(newDate)

						const oldD = oldDate.toISOString().split('T')[0]
						const newD = newDate.toISOString().split('T')[0]

						const oldT = oldDate.toTimeString().split(' ')[0]
						const newT = newDate.toTimeString().split(' ')[0]

						el.old_value = 'value: ' + oldD + ' ' + oldT
						el.new_value = 'value: ' + newD + ' ' + newT
						return el
					}

					if(el.section_field == 'gender') {
						let [, oldBirthDate] = el.old_value.split('value: ')
						let [, newBirthDate] = el.new_value.split('value: ')
						el.old_value = oldBirthDate == 1 ? 'value: male' : oldBirthDate == 2 ? 'value: female' : el.old_value
						el.new_value = newBirthDate == 1 ? 'value: male' : newBirthDate == 2 ? 'value: female' : el.new_value
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
		user:    async global =>  {
			const { client, staff } = await monitoringModel.user({ userId: global.notification_to })
			return client || staff
		},
	}
}
import kpiModel from './model.js'

export default {
	Query: {
		productsKPI: async (_, args, user) => {
			try {
				const statistics = await kpiModel.productsKPI(args, user)

				const servicesObject = statistics.reduce((acc, el) => {
					acc[el.service_id] = acc[el.service_id] || []
					acc[el.service_id].push(el)

					return acc;
				}, {})

				const result = Object.values(servicesObject).map(servicesArray => {
					return {
						service_id: servicesArray[0].service_id,
						total_amount: servicesArray.reduce((acc, el) => {
							if (Object.keys(el.product_size_details).length >= 2) {
								return acc + Object.values(el.product_size_details).reduce((acc, el) => acc * el)
							} else {
								return acc + Object.values(el.product_size_details)[0]
							}
						}, 0)
					}
				})

				return {
					totalProducts: statistics.length,
					services: result
				}
			} catch (error) {
				throw error
			}
		},

		productStatusesKPI: async (_, args, user) => {
			try {
				const statistics = await kpiModel.productStatusesKPI(args, user)
				const { page, limit } = args.pagination

				const result = statistics.map((currentStatus, index) => {
					const previousStatus = statistics[index - 1];

					if (
						previousStatus &&
						currentStatus.product_status_code < previousStatus.product_status_code &&
						currentStatus.product_id == previousStatus.product_id
					) {
						return {
							get statusFrom() {
								const { code: statusCode, name: statusName, description: statusDescription } = process.PRODUCT_STATUSES[previousStatus.product_status_code]
								return { statusCode, statusName, statusDescription }
							},
							get statusTo() {
								const { code: statusCode, name: statusName, description: statusDescription } = process.PRODUCT_STATUSES[currentStatus.product_status_code]
								return { statusCode, statusName, statusDescription }
							},
							createdAt: currentStatus.created_at,
							pruductId: currentStatus.product_id,
							staff_id: currentStatus.staff_id
						}
					}

				}).filter(status => status).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).slice((page - 1) * limit, page * limit)

				return result;
			} catch (error) {
				throw error
			}
		},
	},
	
	ProductServiceKPI: {
		amount: global => global.total_amount,
		service: global => kpiModel.service({ serviceId: global.service_id })
	},

	ProductStatusesKPI: {
		staff: global => kpiModel.staff({ staffId: global.staff_id })
	}
}

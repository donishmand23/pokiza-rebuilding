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
	},
	
	ProductServiceKPI: {
		amount: global => global.total_amount,
		service: global => kpiModel.service({ serviceId: global.service_id })
	}
}

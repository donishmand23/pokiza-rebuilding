import statisticsModel from './model.js'

export default {
	Query: {
		ordersCountStatistics: async (_, args, user) => {
			try {
				const statistics = await statisticsModel.ordersCountStatistics(args, user)
				return statistics
			} catch (error) {
				throw error
			}
		},

		productsCountStatistics: async (_, args, user) => {
			try {
				const orderStatistics = await statisticsModel.ordersCountStatistics(args, user)
				const productsStatistics = await statisticsModel.productsCountStatistics(args, user)

				return {
					...orderStatistics,
					services: productsStatistics.map(el => ({ ...el, ...orderStatistics }))
				}
			} catch (error) {
				throw error
			}
		},
	},

	OrdersCountStatistics: {
		totalOrdersCount: 	  global => global.total_orders_count,
		specialOrdersCount:   global => global.total_special_orders_count,
		simpleOrdersCount:    global => global.total_simple_orders_count,
		specialOrdersPercent: global => {
			return Number((100 / global.total_orders_count) * global.total_special_orders_count).toFixed(1)
		},
		simpleOrdersPercent:  global => {
			return Number((100 / global.total_orders_count) * global.total_simple_orders_count).toFixed(1)
		},
	},

	ProductsCountStatistics: {
		totalOrdersCount:       global => global.total_orders_count,
		totalProductsCount:     global => global.total_products_count,
	},

	ProductsServiceInfo: {
		serviceName:            global => global.service_name,
		serviceUnit:            global => global.service_unit,
		serviceBranchName:      global => global.branch_name,
		serviceProductCount:    global => global.service_products_count,
		serviceProductPercent: global => {
			return Number((100 / global.total_products_count) * global.service_products_count).toFixed(1)
		},
		serviceProductSize: global => {
			const size = global.size_details
				.filter(el => el)
				.reduce((acc, el) => {
					const values = Object.values(el)
					if (values.length > 1) {
						return acc + values.reduce((acc, el) => acc * el)
					} else {
						return acc + values[0]
					}
				}, 0)
			return size
		},
	}
}

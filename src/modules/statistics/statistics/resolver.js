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

		productServiceCountStatistics: async (_, args, user) => {
			try {
				const orderStatistics = await statisticsModel.ordersCountStatistics(args, user)
				const productsStatistics = await statisticsModel.productServiceCountStatistics(args, user)

				return {
					...orderStatistics,
					services: productsStatistics.map(el => ({ ...el, ...orderStatistics }))
				}
			} catch (error) {
				throw error
			}
		},

		productStatusesCountStatistics: async (_, args, user) => {
			try {
				const productsStatistics = await statisticsModel.productStatusesCountStatistics(args, user)
				const statusProductCount = {}
				const statusProductSize = {}
				const distinctProducts = []

				const map = new Map()
				productsStatistics.forEach((el) => {
					statusProductSize[el.product_status_code] = (statusProductSize[el.product_status_code] || 0) + +el.product_size
					statusProductCount[el.product_status_code] = (statusProductCount[el.product_status_code] || 0) + 1

					if (!map.has(el.product_status_code)) {
						map.set(el.product_status_code)
						distinctProducts.push(el)
					}
				})

				return {
					totalProductsCount: productsStatistics.length,
					totalProductSize: Object.values(statusProductSize).reduce((acc, el) => acc + el),
					serviceUnit: productsStatistics[0]?.service_unit || null,
					serviceName: productsStatistics[0]?.service_name || null,
					branchName: productsStatistics[0]?.branch_name || null,
					statuses: distinctProducts.map(el => {
						return {
							statusName: process.PRODUCT_STATUSES[el.product_status_code]?.name,
							statusProductCount: statusProductCount[el.product_status_code],
							statusProductSize: statusProductSize[el.product_status_code],
							statusProductPercent: Number((100 / productsStatistics.length) * statusProductCount[el.product_status_code]).toFixed(1)
						}
					})

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

import statisticsModel from './model.js'

export default {
	Query: {
		ordersCountStatistics: async (_, args, user) => {
			try {
				const statistics = await statisticsModel.ordersCountStatistics(args, user)
				let specialOrdersCount = 0
				let simpleOrdersCount = 0

				for (let el of statistics) {
					if (el.order_special) specialOrdersCount++
					else simpleOrdersCount++
				}

				return {
					totalOrdersCount: statistics[0]?.total_orders_count | 0,
					specialOrdersCount,
					simpleOrdersCount,
					specialOrdersPercent: (100 / statistics.length) * specialOrdersCount | 0,
					simpleOrdersPercent: (100 / statistics.length) * simpleOrdersCount | 0,
				}
			} catch (error) {
				throw error
			}
		},
	}

}

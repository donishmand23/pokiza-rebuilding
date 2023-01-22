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

		serviceProductsCountStatistics: async (_, args, user) => {
			try {
				const statistics = await statisticsModel.serviceProductsCountStatistics(args, user)
				const serviceProductCount = {}
				const serviceProductSize = {}
				const distinctServices = []

				const map = new Map()
				statistics.forEach((el) => {
					serviceProductSize[el.service_id] = (serviceProductSize[el.service_id] || 0) + +el.product_size
					serviceProductCount[el.service_id] = (serviceProductCount[el.service_id] || 0) + 1

					if (!map.has(el.service_id)) {
						map.set(el.service_id)
						distinctServices.push(el)
					}
				})

				return {
					totalProductsCount: statistics.length,
					statusCode: statistics[0]?.product_status_code,
					statusName: process.PRODUCT_STATUSES[statistics[0]?.product_status_code]?.name,
					branchName: statistics[0]?.branch_name,
					services: distinctServices.map(el => {
						return {
							serviceName: el.service_name,
							serviceUnit: el.service_unit,
							serviceProductCount: serviceProductCount[el.service_id],
							serviceProductSize: serviceProductSize[el.service_id],
							serviceProductPercent: Number((100 / statistics.length) * serviceProductCount[el.service_id]).toFixed(1)
						}
					})
				}
			} catch (error) {
				throw error
			}
		},

		branchFinanceStatistics: async (_, args, user) => {
			try {
				const statistics = await statisticsModel.branchFinanceStatistics(args, user)

				if (args.financeDepartment === 'debt') {
					const result = statistics.reduce((newObj, el) => {
						newObj['branch_id'] = el.branch_id
						newObj['totalIncomeCash'] =  	newObj['totalIncomeCash']     +  +el.equity_cash
						newObj['totalIncomeCard'] =  	newObj['totalIncomeCard']     +  +el.equity_card
						newObj['totalIncome'] =      	newObj['totalIncomeCash']     +  newObj['totalIncomeCard']
						newObj['totalOutcomeCash'] = 	newObj['totalOutcomeCash']    +  +el.debt_cash
						newObj['totalOutcomeCard'] = 	newObj['totalOutcomeCard']    +  +el.debt_card
						newObj['totalOutcome'] =     	newObj['totalOutcomeCash']    +  newObj['totalOutcomeCard']
						return newObj
					}, {
						branch_id: 0,
						totalIncomeCash: 0,
						totalIncomeCard: 0,
						totalIncome: 0,
						totalOutcomeCash: 0,
						totalOutcomeCard: 0,
						totalOutcome: 0,
					})

					return result
				}

				if (args.financeDepartment === 'sale') {
					const income = statistics.find(el => el.transaction_type === 'income')
					const outcome = statistics.find(el => el.transaction_type === 'outcome')
					
					return {
						branch_id: income?.branch_id || outcome?.branch_id,
						totalIncomeCash: +income?.total_money_cash || 0,
						totalIncomeCard: +income?.total_money_card || 0,
						totalIncome: (+income?.total_money_cash || 0) + (+income?.total_money_card || 0),
						totalOutcomeCash: +outcome?.total_money_cash || 0,
						totalOutcomeCard: +outcome?.total_money_card || 0,
						totalOutcome: (+outcome?.total_money_cash || 0) + (+outcome?.total_money_card || 0),
					}
				}

				if (args.financeDepartment === 'expanse') {
					const cash = statistics.find(el => el.transaction_money_type === 'cash')
					const card = statistics.find(el => el.transaction_money_type === 'card')

					return {
						branch_id: cash?.branch_id || card?.branch_id,
						totalIncomeCash: 0,
						totalIncomeCard: 0,
						totalIncome: 0,
						totalOutcomeCash: +cash?.sum || 0,
						totalOutcomeCard: +card?.sum || 0,
						totalOutcome: (+cash?.sum || 0) + (+card?.sum || 0),
					}
				}

			} catch (error) {
				throw error
			}
		},

		serviceSummaryStatistics: async (_, args, user) => {
			try {
				const statistics = await statisticsModel.serviceSummaryStatistics(args, user)
				return statistics
			} catch (error) {
				throw error
			}
		},

		socialSetRegistrationStatistics: async (_, args, user) => {
			try {	
				const statistics = await statisticsModel.socialSetRegistrationStatistics(args, user)
				return statistics
			} catch (error) {
				throw error
			}
		}
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
	},

	BranchFinanceStatistics: {
		branch: global => statisticsModel.branch({ branchId: global.branch_id })
	},

	ServiceSummaryStatistics: {
		serviceId:   global => global.service_id,
		serviceName: global => global.service_name,
		branch:      global => statisticsModel.branch({ branchId: global.branch_id })
	},

	SocialSetRegistrationStatistics: {
		socialSetId:   	   global => global.social_set_id,
		socialSetName: 	   global => global.social_set_name,
		socialSetIcon: 	   global => global.social_set_icon,
		registrationCount: global => global.registration_count,
	}
}

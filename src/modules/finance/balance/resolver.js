import { BadRequestError, InternalServerError, AuthorizationError, BadUserInputError, ForbiddenError } from '#errors'
import balanceModel from './model.js'

export default {
	Query: {
		balances: async (_, args, user) => {
			try {
				const balances = await balanceModel.balances(args, user)
				return balances
			} catch(error) {
				throw error
			}
		},

		mainBalances: async (_, args, user) => {
			try {
				const balances = await balanceModel.mainBalances(args, user)
				return balances
			} catch(error) {
				throw error
			}
		},
	},
	
	Balance: {
		balanceId: 		   global => global.balance_id,
		balanceMoneyCash:  global => global.balance_money_cash,
		balanceMoneyCard:  global => global.balance_money_card,
		balanceMoneyTotal: global => global.balance_money_total,
		balanceCreatedAt:  global => global.balance_created_at,
		staff: 			   global => balanceModel.staff({ staffId: global.staff_id }),
		branch:            global => balanceModel.branch({ branchId: global.branch_id }),
	},

	MainBalance: {
		balanceMoneyCash:  global => global.balance_money_cash,
		balanceMoneyCard:  global => global.balance_money_card,
		balanceMoneyTotal: global => global.balance_money_total,
		branch:            global => balanceModel.branch({ branchId: global.branch_id }),
	},
}
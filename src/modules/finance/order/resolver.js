import { BadRequestError, InternalServerError, AuthorizationError, BadUserInputError, ForbiddenError } from '#errors'
import balanceModel from './model.js'

export default {
	Mutation: {
		makeOrderTransaction: async (_, args, user) => {
			try {
				const orderTransaction = await balanceModel.makeOrderTransaction(args, user)
				if (orderTransaction) {
					return {
						status: 200,
						message: "Transaksiya amalga oshirildi!",
						data: orderTransaction
					}
				} else throw new InternalServerError("Transaksiyani amalga oshirishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},
	},
	
	Query: {
		orderTransactions: async (_, args, user) => {
			try {
				const balances = await balanceModel.orderTransactions(args, user)
				return balances
			} catch(error) {
				throw error
			}
		},

	},
	
	OrderTransaction: {
		transactionId: 		   global => global.transaction_id,
		transactionType:       global => global.transaction_type,
		transactionSummary:    global => global.transaction_summary,
		transactionCreatedAt:  global => global.transaction_created_at,
		transactionMoneyCash:  global => global.transaction_money_cash,
		transactionMoneyCard:  global => global.transaction_money_card,
		transactionMoneyTotal: global => global.transaction_money_total,
		branch: global => balanceModel.branch({ branchId: global.branch_id }),
		staff: 	global => balanceModel.staff({ staffId: global.staff_id }),
		order: 	global => balanceModel.order({ orderId: global.order_id }),
	}
}
import { BadRequestError, InternalServerError, AuthorizationError, BadUserInputError, ForbiddenError } from '#errors'
import transactionModel from './model.js'

export default {
	Mutation: {
		makeOrderTransaction: async (_, args, user) => {
			try {
				const orderTransaction = await transactionModel.makeOrderTransaction(args, user)
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

		deleteOrderTransaction: async (_, args, user) => {
			try {
				const deletedOrderTransaction = await transactionModel.deleteOrderTransaction(args, user)
				if (deletedOrderTransaction) {
					return {
						status: 200,
						message: "Transaksiya o'chirildi. Pul akkountga qayta o'tkazildi!",
						data: deletedOrderTransaction
					}
				} else throw new InternalServerError("Transaksiyani o'chirishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},
	},
	
	Query: {
		orderTransactions: async (_, args, user) => {
			try {
				const balances = await transactionModel.orderTransactions(args, user)
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
		transactionStatus:     global => global.transaction_deleted_at ? 'deleted' : 'active',
		branch: global => transactionModel.branch({ branchId: global.branch_id }),
		staff: 	global => transactionModel.staff({ staffId: global.staff_id }),
		order: 	global => transactionModel.order({ orderId: global.order_id }),
	}
}
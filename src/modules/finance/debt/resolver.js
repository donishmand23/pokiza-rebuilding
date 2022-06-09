import { InternalServerError } from '#errors'
import transactionModel from './model.js'

export default {
	Mutation: {
		makeDebtTransaction: async (_, args, user) => {
			try {
				const debtTransaction = await transactionModel.makeDebtTransaction(args, user)
				if (debtTransaction) {
					return {
						status: 200,
						message: "Transaksiya amalga oshirildi!",
						data: debtTransaction
					}
				} else throw new InternalServerError("Transaksiyani amalga oshirishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},
	},
	
	Query: {
		debtTransactions: async (_, args, user) => {
			try {
				const transactions = await transactionModel.debtTransactions(args, user)
				console.log(transactions)
				return transactions
			} catch(error) {
				throw error
			}
		},
	},
	
	DebtTransaction: {
		transactionId: 		   global => global.transaction_id,
		transactionType:       global => global.transaction_type,
		transactionStatus:     global => global.transaction_status,
		transactionSummary:    global => global.transaction_summary,
		transactionCreatedAt:  global => global.transaction_created_at,
		transactionMoneyCash:  global => global.transaction_money_cash,
		transactionMoneyCard:  global => global.transaction_money_card,
		transactionMoneyTotal: global => global.transaction_money_total,
		branch: 	     global => transactionModel.branch({ branchId: global.branch_id }),
		transactionTo:   global => transactionModel.staff({ staffId: global.transaction_to }),
		transactionFrom: global => transactionModel.staff({ staffId: global.transaction_from }),
	}
}
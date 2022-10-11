import { InternalServerError } from '#errors'
import transactionModel from './model.js'

export default {
	Mutation: {
		makeMoneyTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.makeMoneyTransaction(args, user)
				if (transaction) {
					return {
						status: 200,
						message: "Transaksiya amalga oshirildi!",
						data: transaction
					}
				} else throw new InternalServerError("Transaksiyani amalga oshirishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},

		acceptMoneyTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.acceptMoneyTransaction(args, user)
				if (transaction) {
					return {
						status: 200,
						message: "Transaksiya qabul qilindi. Pul o'tkazildi!",
						data: transaction
					}
				} else throw new InternalServerError("Transaksiyani qabul qilishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},

		cancelMoneyTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.cancelMoneyTransaction(args, user)
				if (transaction) {
					return {
						status: 200,
						message: "Transaksiya bekor qilindi!",
						data: transaction
					}
				} else throw new InternalServerError("Transaksiyani bekor qilishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},

		deleteMoneyTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.deleteMoneyTransaction(args, user)
				if (transaction) {
					return {
						status: 200,
						message: "Transaksiya o'chirildi. Pul hisoblarga qaytarildi!",
						data: transaction
					}
				} else throw new InternalServerError("Transaksiyani o'chirishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},

		changeMoneyTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.changeMoneyTransaction(args, user)
				if (transaction) {
					return {
						status: 200,
						message: "Transaksiya o'zgartirildi!",
						data: transaction
					}
				} else throw new InternalServerError("Transaksiyani o'zgartirishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},
	},
	
	Query: {
		moneyTransactions: async (_, args, user) => {
			try {
				const transactions = await transactionModel.moneyTransactions(args, user)
				return transactions
			} catch(error) {
				throw error
			}
		},
	},
	
	MoneyTransaction: {
		count:                 global => global.count,
		transactionId: 		   global => global.transaction_id,
		transactionType:       global => global.transaction_type,
		transactionMoney:      global => global.transaction_money,
		transactionStatus:     global => global.transaction_status,
		transactionSummary:    global => global.transaction_summary,
		transactionCreatedAt:  global => global.transaction_created_at,
		transactionMoneyType:  global => global.transaction_money_type,
		branch: 	     global => transactionModel.branch({ branchId: global.branch_id }),
		transactionTo:   global => transactionModel.staff({ staffId: global.transaction_to }),
		transactionFrom: global => transactionModel.staff({ staffId: global.transaction_from }),
	},
}
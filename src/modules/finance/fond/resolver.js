import { InternalServerError } from '#errors'
import transactionModel from './model.js'

export default {
	Mutation: {
		makeFondTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.makeFondTransaction(args, user)
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

		acceptFondTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.acceptFondTransaction(args, user)
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

		cancelFondTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.cancelFondTransaction(args, user)
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

		deleteFondTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.deleteFondTransaction(args, user)
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

		changeFondTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.changeFondTransaction(args, user)
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
		fondTransactions: async (_, args, user) => {
			try {
				const transactions = await transactionModel.fondTransactions(args, user)
				return transactions
			} catch(error) {
				throw error
			}
		},
	},
	
	FondTransaction: {
		transactionId: 		   global => global.transaction_id,
		transactionType:       global => global.transaction_type,
		transactionMoney:      global => global.transaction_money,
		transactionStatus:     global => global.transaction_status,
		transactionSummary:    global => global.transaction_summary,
		transactionCreatedAt:  global => global.transaction_fond_created_at,
		transactionMoneyType:  global => global.transaction_money_type,
		branchTo: 	     global => transactionModel.branch({ branchId: global.branch_to }),
		branchFrom: 	 global => transactionModel.branch({ branchId: global.branch_from }),
		transactionTo:   global => transactionModel.staff({ staffId: global.transaction_to }),
		transactionFrom: global => transactionModel.staff({ staffId: global.transaction_from }),
	},
}
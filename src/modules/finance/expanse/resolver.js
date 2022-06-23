import { InternalServerError } from '#errors'
import transactionModel from './model.js'

export default {
	Mutation: {
		makeExpanseTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.makeExpanseTransaction(args, user)
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

		acceptExpanseTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.acceptExpanseTransaction(args, user)
				if (transaction) {
					return {
						status: 200,
						message: "Transaksiya qabul qilindi!",
						data: transaction
					}
				} else throw new InternalServerError("Transaksiyani qabul qilishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},

		cancelExpanseTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.cancelExpanseTransaction(args, user)
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

		deleteExpanseTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.deleteExpanseTransaction(args, user)
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

		changeExpanseTransaction: async (_, args, user) => {
			try {
				const transaction = await transactionModel.changeExpanseTransaction(args, user)
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

		addExpanse: async (_, args, user) => {
			try {
				const expanse = await transactionModel.addExpanse(args, user)
				if (expanse) {
					return {
						status: 200,
						message: "Xarajat turi qo'shildi!",
						data: expanse
					}
				} else throw new InternalServerError("Xarajat turini qo'shishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},

		deleteExpanse: async (_, args, user) => {
			try {
				const expanse = await transactionModel.deleteExpanse(args, user)
				if (expanse) {
					return {
						status: 200,
						message: "Xarajat turi o'chirildi!",
						data: expanse
					}
				} else throw new InternalServerError("Xarajat turini o'chirishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},
	},
	
	Query: {
		expanseTransactions: async (_, args, user) => {
			try {
				const transactions = await transactionModel.expanseTransactions(args, user)
				return transactions
			} catch(error) {
				throw error
			}
		},

		expanses: async (_, args, user) => {
			try {
				const expanses = await transactionModel.expanses(args, user)
				return expanses
			} catch(error) {
				throw error
			}
		},
	},
	
	ExpanseTransaction: {
		transactionId: 		   global => global.transaction_id,
		transactionType:       global => global.transaction_type,
		transactionMoney:      global => global.transaction_money,
		transactionStatus:     global => global.transaction_status,
		transactionSummary:    global => global.transaction_summary,
		transactionCreatedAt:  global => global.transaction_created_at,
		transactionMoneyType:  global => global.transaction_money_type,
		transactionFrom: global => transactionModel.staff({ staffId: global.transaction_from }),
		transactionTo:   global => transactionModel.staff({ staffId: global.transaction_to }),
		branch: 	     global => transactionModel.branch({ branchId: global.branch_id }),
		expanse: async global => {
			const [expanse] = await transactionModel.expanses({ expanseId: global.expanse_id })
			return expanse
		},
	},

	Expanse: {
		expanseId:        global => global.expanse_id,
		expanseName:      global => global.expanse_name,
		expanseCreatedAt: global => global.expanse_created_at,
	}
}
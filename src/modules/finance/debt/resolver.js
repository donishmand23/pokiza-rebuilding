import { InternalServerError } from '#errors'
import transactionModel from './model.js'

export default {
	Mutation: {
		makeDebtTransactionIncome: async (_, args, user) => {
			try {
				const debtTransaction = await transactionModel.makeDebtTransactionIncome(args, user)
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

		makeDebtTransactionOutcome: async (_, args, user) => {
			try {
				const debtTransaction = await transactionModel.makeDebtTransactionOutcome(args, user)
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

		cancelDebtTransaction: async (_, args, user) => {
			try {
				const debtTransaction = await transactionModel.cancelDebtTransaction(args, user)
				if (debtTransaction) {
					return {
						status: 200,
						message: "Transaksiya bekor qilindi!",
						data: debtTransaction
					}
				} else throw new InternalServerError("Transaksiyani bekor qilishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},

		acceptDebtTransaction: async (_, args, user) => {
			try {
				const debtTransaction = await transactionModel.acceptDebtTransaction(args, user)
				if (debtTransaction) {
					return {
						status: 200,
						message: "Transaksiya qabul qilindi. Pul o'tkazildi!",
						data: debtTransaction
					}
				} else throw new InternalServerError("Transaksiyani qabul qilishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},

		deleteDebtTransaction: async (_, args, user) => {
			try {
				const debtTransaction = await transactionModel.deleteDebtTransaction(args, user)
				if (debtTransaction) {
					return {
						status: 200,
						message: "Transaksiya o'chirildi. Pul hisoblarga qaytarildi!",
						data: debtTransaction
					}
				} else throw new InternalServerError("Transaksiyani o'chirishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},

		changeDebtTransaction: async (_, args, user) => {
			try {
				const debtTransaction = await transactionModel.changeDebtTransaction(args, user)
				if (debtTransaction) {
					return {
						status: 200,
						message: "Transaksiya o'zgartirildi!",
						data: debtTransaction
					}
				} else throw new InternalServerError("Transaksiyani o'zgartirishda muammolik yuz berdi!")
			} catch (error) {
				throw error
			}
		},
	},
	
	Query: {
		debtTransactions: async (_, args, user) => {
			try {
				const transactions = await transactionModel.debtTransactions(args, user)
				return transactions
			} catch(error) {
				throw error
			}
		},

		equities: async (_, args, user) => {
			try {
				const equities = await transactionModel.equities(args, user)
				return equities
			} catch(error) {
				throw error
			}
		},
	},
	
	DebtTransaction: {
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

	Equity: {
		debtCash:    global => global.debt_cash,
		debtCard:    global => global.debt_card,
		equityCash:  global => global.equity_cash,
		equityCard:  global => global.equity_card,
		totalDebt:   global => +global.debt_cash + +global.debt_card,
		totalEquity: global => +global.equity_cash + +global.equity_card,
		branch: 	 global => transactionModel.branch({ branchId: global.branch_id }),
		staff:   	 global => transactionModel.staff({ staffId: global.staff_id }),
	},
}
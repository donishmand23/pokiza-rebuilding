import { BadRequestError, ForbiddenError } from '#errors'
import { fetch, fetchAll } from '#utils/postgres'
import OrderTransactionQuery from '#sql/orderTransaction'
import DebtTransactionQuery from '#sql/debtTransaction'
import BalanceQuery from '#sql/balance'
import BranchQuery from '#sql/branch'
import OrderQuery from '#sql/order'
import UserQuery from '#sql/user'

const debtTransactions = ({ 
	branchId,
	moneyType,
	dateFilter,
	moneyAmount,
	transactionId,
	transactionTo,
	transactionFrom,
	transactionType,
	transactionStatus
 }, user) => {
	dateFilter = dateFilter ? [dateFilter.from, dateFilter.to] : []

	if (transactionType === 'income') {
		transactionTo = user.staffId
	}

	if (transactionType === 'outcome') {
		transactionFrom = user.staffId
	}

	return fetchAll(
		DebtTransactionQuery.TRANSACTIONS, transactionId,
		branchId, transactionTo, transactionFrom, moneyType, moneyAmount,
		transactionType, dateFilter, user.staffId, transactionStatus
	)
}

const staff = async ({ staffId }) => {
	const { staff } = await fetch(UserQuery.USER, false, 0, staffId, 0)
	return staff
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const makeDebtTransaction = async ({
	transactionTo, 
	transactionFrom, 
	transactionType, 
	transactionSummary,
	transactionDateTime,
	transactionMoneyCash, 
	transactionMoneyCard, 
}, user) => {

	if (transactionType === 'income' && transactionTo != user.staffId) {
		throw new ForbiddenError("Transaksiyani amalga oshirish mumkin emas. Yuboriluvchi o'zingiz bo'lishingiz kerak!")
	}

	if (transactionType === 'outcome' && transactionFrom != user.staffId) {
		throw new ForbiddenError("Transaksiyani amalga oshirish mumkin emas. Yuboruvchi o'zingiz bo'lishingiz kerak!")
	}

	const senderBalance = await fetch(BalanceQuery.BALANCES, [transactionFrom], [])
	const receiverBalance = await fetch(BalanceQuery.BALANCES, [transactionTo], [])

	if (
		!senderBalance ||
		senderBalance && senderBalance.balance_money_cash < transactionMoneyCash
	) {
		throw new BadRequestError("Yuboruvchi kassasida yetarlicha mablag' yo'q yoki kassa hali ochilmagan!")
	}
	
	const status = transactionType === 'income' ? 'accepted' : 'pending'
	const transaction = await fetch(DebtTransactionQuery.MAKE_TRANSACTION, transactionMoneyCash, transactionMoneyCard, transactionFrom, transactionTo, status, transactionSummary, transactionDateTime)
	
	if (transactionType === 'income') {
		if (!receiverBalance) {
			await fetch(BalanceQuery.CREATE_BALANCE, transactionTo)
		}
		await fetch(BalanceQuery.DECREMENT_BALANCE, transactionFrom, transactionMoneyCash, transactionMoneyCard)
		await fetch(BalanceQuery.INCREMENT_BALANCE, transactionTo, transactionMoneyCash, transactionMoneyCard)
	}

	return transaction
}


export default {
	makeDebtTransaction,
	debtTransactions,
	branch,
	staff,
}
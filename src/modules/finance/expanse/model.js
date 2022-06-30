import { setMonitoring } from '#helpers/monitoring'
import { fetch, fetchAll } from '#utils/postgres'
import { BadRequestError } from '#errors'
import ExpanseTransactionQuery from '#sql/expanseTransaction'
import BalanceQuery from '#sql/balance'
import BranchQuery from '#sql/branch'
import UserQuery from '#sql/user'

const expanseTransactions = ({
	branchId,
	expanseId,
	moneyType,
	pagination,
	dateFilter,
	moneyAmount,
	transactionId,
	transactionTo,
	transactionFrom,
	transactionType,
	transactionStatus,
 }, user) => {
	dateFilter = dateFilter ? [dateFilter.from, dateFilter.to] : []
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)
	const { page, limit } = pagination

	return fetchAll(
		ExpanseTransactionQuery.TRANSACTIONS, (page - 1) * limit, limit, transactionId,
		branchId, transactionTo, transactionFrom, moneyType, moneyAmount,
		transactionType, dateFilter, transactionStatus, expanseId,
		user.personal, user.personalBranchId, user.staffId
	)
}

const expanses = ({ expanseId }) => {
	return fetchAll(ExpanseTransactionQuery.EXPANSES, expanseId)
}

const staff = async ({ staffId }) => {
	const { staff } = await fetch(UserQuery.USER, false, 0, staffId, 0)
	return staff
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const addExpanse = ({ expanseName }) => {
	return fetch(ExpanseTransactionQuery.ADD_EXPANSE, expanseName)
}

const deleteExpanse = ({ expanseId }) => {
	return fetch(ExpanseTransactionQuery.DELETE_EXPANSE, expanseId)
}

const makeExpanseTransaction = async ({
	expanseId,
	transactionTo,
	transactionFrom,
	transactionMoney,
	transactionSummary,
	transactionDateTime,
	transactionMoneyType
}, user) => {
	const senderBalance = await fetch(BalanceQuery.BALANCE, transactionFrom, 0)

	if (
		(!senderBalance) ||
		(senderBalance && transactionMoneyType === 'cash' && senderBalance.balance_money_cash < transactionMoney) ||
		(senderBalance && transactionMoneyType === 'card' && senderBalance.balance_money_card < transactionMoney)
	) {
		throw new BadRequestError("Yuboruvchi kassasida yetarlicha mablag' yo'q yoki kassa hali ochilmagan!")
	}

	const transaction = await fetch(ExpanseTransactionQuery.MAKE_TRANSACTION, transactionMoney, transactionMoneyType, transactionFrom, transactionTo, 'pending', transactionSummary, expanseId, transactionDateTime)

	return transaction
}

const acceptExpanseTransaction = async ({ transactionId }, user) => {
	const oldTransaction = await fetch(ExpanseTransactionQuery.TRANSACTION, transactionId, 0, 0)

	if (oldTransaction?.transaction_status !== 'pending') {
		throw new BadRequestError("Holati 'pending' bo'lgan transaksiyalarnigina qabul qilish mumkin!")
	}

	const senderBalance = await fetch(BalanceQuery.BALANCE, oldTransaction.transaction_from, 0)

	if (
		(!senderBalance) ||
		(senderBalance && oldTransaction.transaction_money_type === 'cash' && senderBalance.balance_money_cash < oldTransaction.transaction_money) ||
		(senderBalance && oldTransaction.transaction_money_type === 'card' && senderBalance.balance_money_card < oldTransaction.transaction_money)
	) {
		throw new BadRequestError("Yuboruvchi kassasida yetarlicha mablag' yo'q yoki kassa hali ochilmagan!")
	}

	const transaction = await fetch(ExpanseTransactionQuery.ACCEPT_TRANSACTION, transactionId)

	const decrement = await fetch(
		BalanceQuery.DECREMENT_BALANCE, transaction.transaction_from,
		transaction.transaction_money_type === 'cash' ? transaction.transaction_money : 0,
		transaction.transaction_money_type === 'card' ? transaction.transaction_money : 0,
	)

	const transactionBranch = await fetch(ExpanseTransactionQuery.TRANSACTION_BRANCH, transactionId)
	if (transaction) setMonitoring({
		userId: user.userId,
		sectionId: transactionId,
		sectionName: 'financeExpanses',
		operationType: 'changed',
		branchId: transactionBranch.branch_id,
	}, {
		old_status: oldTransaction.transaction_status,
		new_status: transaction.transaction_status,
	})

	if (decrement) return transaction
}

const cancelExpanseTransaction = async ({ transactionId }, user) => {
	const oldTransaction = await fetch(ExpanseTransactionQuery.TRANSACTION, transactionId, 0, 0)

	if (oldTransaction?.transaction_status !== 'pending') {
		throw new BadRequestError("Holati 'pending' bo'lgan transaksiyalarnigina bekor qilish mumkin!")
	}

	const transaction = await fetch(ExpanseTransactionQuery.CANCEL_TRANSACTION, transactionId)

	const transactionBranch = await fetch(ExpanseTransactionQuery.TRANSACTION_BRANCH, transactionId)
	if (transaction) setMonitoring({
		userId: user.userId,
		sectionId: transactionId,
		sectionName: 'financeExpanses',
		operationType: 'changed',
		branchId: transactionBranch.branch_id,
	}, {
		old_status: oldTransaction.transaction_status,
		new_status: transaction.transaction_status,
	})

	return transaction
}

const deleteExpanseTransaction = async ({ transactionId }, user) => {
	const oldTransaction = await fetch(ExpanseTransactionQuery.TRANSACTION, transactionId, 0, 0)

	if (!['pending', 'accepted'].includes(oldTransaction?.transaction_status)) {
		throw new BadRequestError("Holati 'pending' yoki 'accepted' bo'lgan transaksiyalarnigina o'chirish mumkin!")
	}
	
	const transaction = await fetch(ExpanseTransactionQuery.DELETE_TRANSACTION, transactionId)

	if (oldTransaction.transaction_status === 'accepted') {
		await fetch(
			BalanceQuery.INCREMENT_BALANCE, transaction.transaction_from,
			transaction.transaction_money_type === 'cash' ? transaction.transaction_money : 0,
			transaction.transaction_money_type === 'card' ? transaction.transaction_money : 0,
		)
	}

	const transactionBranch = await fetch(ExpanseTransactionQuery.TRANSACTION_BRANCH, transactionId)
	if (transaction) setMonitoring({
		userId: user.userId,
		sectionId: transactionId,
		sectionName: 'financeExpanses',
		operationType: 'changed',
		branchId: transactionBranch.branch_id,
	}, {
		old_status: oldTransaction.transaction_status,
		new_status: transaction.transaction_status,
	})
		
	return transaction
}

const changeExpanseTransaction = async ({ 
	expanseId,
	transactionId,
	transactionTo,
	transactionFrom,
	transactionMoney,
	transactionSummary,
	transactionDateTime,
	transactionMoneyType
 }, user) => {
	const oldTransaction = await fetch(ExpanseTransactionQuery.TRANSACTION, transactionId, 0, 0)

	if (!['pending', 'accepted'].includes(oldTransaction?.transaction_status)) {
		throw new BadRequestError("Holati 'pending' yoki 'accepted' bo'lgan transaksiyalarnigina o'zgartirish mumkin!")
	}

	if (
		(transactionTo || transactionFrom) &&
		(oldTransaction.transaction_status === 'accepted')
	) {
		throw new BadRequestError("Qabul qilingan transaksiyaning yuboruvchi va qabul qiluvchisini o'zgartirish mumkin emas!")
	}

	if (oldTransaction.transaction_status === 'accepted') { 
		await fetch(
			BalanceQuery.INCREMENT_BALANCE, oldTransaction.transaction_from,
			oldTransaction.transaction_money_type === 'cash' ? oldTransaction.transaction_money : 0,
			oldTransaction.transaction_money_type === 'card' ? oldTransaction.transaction_money : 0,
		)
	}

	const transaction = await fetch(
		ExpanseTransactionQuery.UPDATE_TRANSACTION,
		transactionId, transactionTo, transactionFrom, transactionMoney, transactionMoneyType, transactionSummary, transactionDateTime, expanseId
	)

	if (oldTransaction.transaction_status === 'accepted') {
		await fetch(
			BalanceQuery.DECREMENT_BALANCE, transaction.transaction_from,
			transaction.transaction_money_type === 'cash' ? transaction.transaction_money : 0,
			transaction.transaction_money_type === 'card' ? transaction.transaction_money : 0,
		)
	}

	const transactionBranch = await fetch(ExpanseTransactionQuery.TRANSACTION_BRANCH, transactionId)
	if (transaction) setMonitoring({
		userId: user.userId,
		sectionId: transactionId,
		sectionName: 'financeExpanses',
		operationType: 'changed',
		branchId: transactionBranch.branch_id,
	}, {
		old_receiver: oldTransaction.transaction_to,
		new_receiver: transaction.transaction_to,
		old_sender: oldTransaction.transaction_from,
		new_sender: transaction.transaction_from,
		old_money: oldTransaction.transaction_money,
		new_money: transaction.transaction_money,
		old_summary: oldTransaction.transaction_summary,
		new_summary: transaction.transaction_summary,
		old_date_time: oldTransaction.transaction_created_at,
		new_date_time: transaction.transaction_created_at,
		old_money_type: oldTransaction.transaction_money_type,
		new_money_type: transaction.transaction_money_type,
		old_expanse: transaction.expanse_id,
		new_expanse: transaction.expanse_id,
	})
	
	return transaction
}


export default {
	acceptExpanseTransaction,
	cancelExpanseTransaction,
	deleteExpanseTransaction,
	changeExpanseTransaction,
	makeExpanseTransaction,
	expanseTransactions,
	deleteExpanse,
	addExpanse,
	expanses,
	branch,
	staff,
}
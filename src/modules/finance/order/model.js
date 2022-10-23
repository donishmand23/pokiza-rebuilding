import { BadRequestError } from '#errors'
import { setMonitoring } from '#helpers/monitoring'
import { fetch, fetchAll } from '#utils/postgres'
import OrderTransactionQuery from '#sql/orderTransaction'
import BalanceQuery from '#sql/balance'
import BranchQuery from '#sql/branch'
import OrderQuery from '#sql/order'
import UserQuery from '#sql/user'

const orderTransactions = ({ staffId, branchId, orderId, dateFilter, transactionType, moneyAmount, transactionId, pagination }, user) => {
	dateFilter = dateFilter ? [dateFilter.from, dateFilter.to] : []
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)
	const { page, limit } = pagination

	return fetchAll(
		OrderTransactionQuery.TRANSACTIONS, (page - 1) * limit, limit,
		transactionId, staffId, branchId, orderId, transactionType, dateFilter, moneyAmount,
		user.personal, user.personalBranchId, user.staffId
	)
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const order = ({ orderId }) => {
	return fetch(OrderQuery.ORDER, null, orderId, [])
}

const staff = async ({ staffId }) => {
	const { staff } = await fetch(UserQuery.USER, false, 0, staffId, 0)
	return staff
}

const makeOrderTransaction = async ({ orderId, transactionMoneyCash, transactionMoneyCard, transactionType, transactionSummary }, user) => {
	const binding = await fetch(OrderQuery.ORDER_BINDING, orderId, 0, 0, 0)
	const statuses = await fetchAll(OrderQuery.ORDER_STATUSES, orderId)

	if (statuses.at(-1) != 9 && transactionType === 'income') {
		throw new BadRequestError("Transaksiyani amalga oshirish uchun buyurtma yetkazildi statusida bo'lishi kerak!")
	}

	const order = await fetch(OrderQuery.ORDER, null, orderId, [])
	if (order.order_price > transactionMoneyCash + transactionMoneyCard && transactionType === 'income') {
		throw new BadRequestError(`Transaksiyani amalga oshirish uchun buyurtma summasi ${order.order_price} ga teng yoki yuqori bo'lishi kerak!`)
	}

	if (order.order_price < transactionMoneyCard + transactionMoneyCash && transactionType === 'outcome') {
		throw new BadRequestError(`Transaksiyani o'zgartirish uchun buyurtma summasi ${order.order_price} ga teng yoki kichik bo'lishi kerak!`)
	}

	const transaction = await fetch(OrderTransactionQuery.MAKE_TRANSACTION, orderId, binding.staff_id, transactionMoneyCash, transactionMoneyCard, transactionType, transactionSummary)

	const balance = await fetch(BalanceQuery.BALANCE, binding.staff_id, 0)
	if (!balance) {
		await fetch(BalanceQuery.CREATE_BALANCE, binding.staff_id)
	}
	
	if (transactionType === 'income') {
		await fetch(BalanceQuery.INCREMENT_BALANCE, binding.staff_id, transactionMoneyCash, transactionMoneyCard)
	}

	if (transactionType === 'outcome') {
		await fetch(BalanceQuery.DECREMENT_BALANCE, binding.staff_id, transactionMoneyCash, transactionMoneyCard)
	}
	
	return transaction
}

const deleteOrderTransaction = async ({ transactionId }, user) => {
	const transaction = await fetch(OrderTransactionQuery.DELETE_TRANSACTION, transactionId)

	if (transaction?.transaction_type === 'income') {
		const transactions = await fetchAll(OrderTransactionQuery.TRANSACTION, 0, 0, 0, transaction.order_id, 'outcome')
		const transactionMoneyCash = transaction.transaction_money_cash - transactions.reduce((acc, el) => acc + el.transaction_money_cash, 0)
		const transactionMoneyCard = transaction.transaction_money_card - transactions.reduce((acc, el) => acc + el.transaction_money_card, 0)
		await fetch(BalanceQuery.DECREMENT_BALANCE, transaction.staff_id, transactionMoneyCash, transactionMoneyCard)
	}

	if (transaction?.transaction_type === 'outcome') {
		await fetch(BalanceQuery.INCREMENT_BALANCE, transaction.staff_id, transaction.transaction_money_cash, transaction.transaction_money_card)
	}

	const transactionBranch = await fetch(OrderTransactionQuery.TRANSACTION_BRANCH, transactionId)
	if (transaction) setMonitoring({
		userId: user.userId,
		sectionId: transactionId,
		sectionName: 'financeOrders',
		operationType: 'changed',
		branchId: transactionBranch.branch_id,
	}, {
		old_status: 'active',
		new_status: 'deleted',
	})
	
	return transaction
}

const changeOrderTransaction = async ({ transactionId, transactionMoneyCash, transactionMoneyCard, transactionSummary }, user) => {
	const oldTransaction = await fetch(OrderTransactionQuery.TRANSACTION, transactionId, 0, 0, 0, undefined)
	const order = await fetch(OrderQuery.ORDER, null, oldTransaction.order_id, [])

	if (
		(oldTransaction.transaction_type === 'income') && 
		(transactionMoneyCash || transactionMoneyCard) &&
		(order.order_price > transactionMoneyCard + transactionMoneyCash)
	) {
		throw new BadRequestError(`Transaksiyani o'zgartirish uchun buyurtma summasi ${order.order_price} ga teng yoki yuqori bo'lishi kerak!`)
	}

	if (
		(oldTransaction.transaction_type === 'outcome') &&
		(transactionMoneyCash || transactionMoneyCard) &&
		(order.order_price < transactionMoneyCard + transactionMoneyCash)
	) {
		throw new BadRequestError(`Transaksiyani o'zgartirish uchun buyurtma summasi ${order.order_price} ga teng yoki kichik bo'lishi kerak!`)
	}

	const transaction = await fetch(OrderTransactionQuery.UPDATE_TRANSACTION, transactionId, transactionMoneyCash, transactionMoneyCard, transactionSummary)

	if ((transactionMoneyCash || transactionMoneyCard) && transaction?.transaction_type === 'income') {
		await fetch(BalanceQuery.DECREMENT_BALANCE, oldTransaction.staff_id, oldTransaction.transaction_money_cash, oldTransaction.transaction_money_card)
		await fetch(BalanceQuery.INCREMENT_BALANCE, oldTransaction.staff_id, transaction.transaction_money_cash, transaction.transaction_money_card)
	}

	if ((transactionMoneyCash || transactionMoneyCard) && transaction?.transaction_type === 'outcome') {
		await fetch(BalanceQuery.INCREMENT_BALANCE, oldTransaction.staff_id, oldTransaction.transaction_money_cash, oldTransaction.transaction_money_card)
		await fetch(BalanceQuery.DECREMENT_BALANCE, transaction.staff_id, transaction.transaction_money_cash, transaction.transaction_money_card)
	}

	const transactionBranch = await fetch(OrderTransactionQuery.TRANSACTION_BRANCH, transactionId)
	if (transaction) setMonitoring({
		userId: user.userId,
		sectionId: transactionId,
		sectionName: 'financeOrders',
		operationType: 'changed',
		branchId: transactionBranch.branch_id,
	}, {
		old_money_cash: oldTransaction.transaction_money_cash,
		old_money_card: oldTransaction.transaction_money_card,
		new_money_cash: transaction.transaction_money_cash,
		new_money_card: transaction.transaction_money_card,
		old_summary: oldTransaction.transaction_summary,
		new_summary: transaction.transaction_summary,
	})
	
	return transaction
}

export default {
	changeOrderTransaction,
	deleteOrderTransaction,
	makeOrderTransaction,
	orderTransactions,
	branch,
	staff,
	order,
}
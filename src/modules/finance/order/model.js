import { BadRequestError, InternalServerError, AuthorizationError, BadUserInputError, ForbiddenError } from '#errors'
import { fetch, fetchAll } from '#utils/postgres'
import OrderTransactionQuery from '#sql/orderTransaction'
import BalanceQuery from '#sql/balance'
import BranchQuery from '#sql/branch'
import OrderQuery from '#sql/order'
import UserQuery from '#sql/user'

const orderTransactions = ({ staffId, branchId, orderId, dateFilter, transactionType }, user) => {
	dateFilter = dateFilter ? [dateFilter.from, dateFilter.to] : []

	return fetchAll(OrderTransactionQuery.TRANSACTIONS, 0, staffId, branchId, orderId, transactionType, dateFilter)
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
	const binding = await fetch(OrderQuery.ORDER_BINDING, orderId, 0, 0, user.staffId)
	if (!binding) {
		throw new ForbiddenError("Transaksiyani faqat buyurtma biriktirilgan transport haydovchi amalga oshira oladi!")
	}

	const statuses = await fetchAll(OrderQuery.ORDER_STATUSES, orderId)
	if (statuses.at(-1) != 9 && transactionType === 'income') {
		throw new BadRequestError("Transaksiyani amalga oshirish uchun buyurtma yetkazildi statusida bo'lishi kerak!")
	}

	const order = await fetch(OrderQuery.ORDER, null, orderId, [])
	if (order.order_price > transactionMoneyCash + transactionMoneyCard && transactionType === 'income') {
		throw new BadRequestError(`Transaksiyani amalga oshirish uchun buyurtma summasi ${order.order_price} ga teng yoki yuqori bo'lishi kerak!`)
	}

	const transaction = await fetch(OrderTransactionQuery.MAKE_TRANSACTION, orderId, user.staffId, transactionMoneyCash, transactionMoneyCard, transactionType, transactionSummary)
	
	if (transactionType === 'income') {
		await fetch(BalanceQuery.INCREMENT_BALANCE, user.staffId, transactionMoneyCash, transactionMoneyCard)
	}

	if (transactionType === 'outcome') {
		await fetch(BalanceQuery.DECREMENT_BALANCE, user.staffId, transactionMoneyCash, transactionMoneyCard)
	}
	
	return transaction
}

const deleteOrderTransaction = async ({ transactionId }, user) => {
	const transaction = await fetch(OrderTransactionQuery.DELETE_TRANSACTION, transactionId, user.staffId)
	if (!transaction) {
		throw new ForbiddenError("Siz bu transaksiyani amalga oshirmaganligingiz uchun uni o'chira olmaysiz yoki bunday transaksiya mavjud emas!")
	}
	
	if (transaction.transaction_type === 'income') {
		await fetch(BalanceQuery.DECREMENT_BALANCE, user.staffId, transaction.transaction_money_cash, transaction.transaction_money_card)
	}

	if (transaction.transaction_type === 'outcome') {
		await fetch(BalanceQuery.INCREMENT_BALANCE, user.staffId, transaction.transaction_money_cash, transaction.transaction_money_card)
	}
	
	return transaction
}

export default {
	deleteOrderTransaction,
	makeOrderTransaction,
	orderTransactions,
	branch,
	staff,
	order,
}
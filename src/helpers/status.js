import { InternalServerError } from '#errors'
import { fetch } from '#utils/postgres'
import ProductQuery from '#sql/product'
import OrderQuery from '#sql/order'


async function changeStatus ({ staffId, orderId, productId }) {
	try {
		const {
			product_general_status,
			product_status_sum,
			product_length,
			order_status,
			products,
			order_id
		} = await fetch(ProductQuery.ORDER_AND_PRODUCT_STATUS_INFO, orderId, productId)

		if (productId && product_general_status >= 2 && !(order_status >= 5)) {
			return fetch(OrderQuery.CHANGE_ORDER_STATUS, order_id, 5, staffId)
		}

		if (productId && product_general_status >= 7 && !(order_status >= 5)) {
			return fetch(OrderQuery.CHANGE_ORDER_STATUS, order_id, 6, staffId)
		}

		if (productId && product_general_status >= 8 && !(order_status >= 7)) {
			return fetch(OrderQuery.CHANGE_ORDER_STATUS, order_id, 7, staffId)
		}

		if (productId && product_general_status >= 9 && !(order_status >= 8)) {
			return fetch(OrderQuery.CHANGE_ORDER_STATUS, order_id, 8, staffId)
		}

		if (productId && product_general_status >= 10 && !(order_status >= 9)) {
			return fetch(OrderQuery.CHANGE_ORDER_STATUS, order_id, 9, staffId)
		}

		if (orderId && order_status == 7) {
			for (let product of products) {
				if (product.status_code == 7) {
					await fetch(ProductQuery.CHANGE_PRODUCT_STATUS, productId, 8, staffId)
				}

				if (
					products.map(el => +el.status_code).filter(el => el == 1).length >= 2
				) {
					await fetch(OrderQuery.CHANGE_ORDER_STATUS, order_id, 10, staffId)
				}

			}
			return
		}

	} catch (error) {
		throw new InternalServerError(error.message || error.detail || error)
	}
}


export default changeStatus
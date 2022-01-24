import { checkUserInfo, checkContact, checkAddress } from '#helpers/checkInput'
import { fetch, fetchAll } from '#utils/postgres'
import ProductQuery from '#sql/product'
import OrderQuery from '#sql/order'
import ServiceQuery from '#sql/service'


const products = ({
	sort,
	search,
	orderId,
	branchId,
	clientId,
	productId,
	isDeleted,
	serviceId,
	pagination,
	dateFilter,
	productPrice,
	productStatus,
	addressFilter,
	productSpecial
}, user) => {
	const sortNameValues = { 
		productId: 1, productStatus: 2, productPrice: 3, 
		addressDistance: 4, firstName: 5, lastName: 6, 
		orderId: 7, broughtTime: 8, deliveredTime: 9, bringTime: 10, deliveryTime: 11 
	}

	const sortObject = Object.keys(sort).map(key => {
		if(sort[key]) {
			return { sortKey: sortNameValues[key], value: sort[key] }
		}
	} ).filter( elem => elem !== undefined )[0]

	Object.keys(dateFilter).map(key => {
		dateFilter[key] = [dateFilter[key].from, dateFilter[key].to]
	})

	productPrice = (productPrice?.from && productPrice?.to) ? [productPrice.from, productPrice.to] : []

	if(user.clientId) {
		clientId = [user.clientId]
	}

	const { page, limit } = pagination
	const { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter
	const { bringTime, broughtTime, deliveryTime, deliveredTime, productCreatedAt } = dateFilter

	return fetchAll(
		ProductQuery.PRODUCTS,
		(page - 1) * limit, limit, isDeleted,
		productId, orderId, clientId, branchId, serviceId, productStatus, productPrice, productSpecial, search,
		bringTime, broughtTime, deliveryTime, deliveredTime, productCreatedAt,
		stateId, regionId, neighborhoodId, streetId, areaId,
		sortObject?.sortKey || 1, sortObject?.value || 1
	)
}

const service = ({ serviceId }) => {
	return fetch(ServiceQuery.SERVICES, null, serviceId, [])
}

const productStatuses = ({ productId }) => {
	return fetchAll(ProductQuery.PRODUCT_STATUSES, productId)
}

const order = ({ orderId }) => {
	return fetch(OrderQuery.ORDER, null, orderId, [])
}

const addProduct = async ({ orderId, serviceId, file, productSizeDetails, productSummary }, { staffId }) => {
	if(typeof productSizeDetails !== 'object' || Array.isArray(productSizeDetails)) {
		throw new Error("productSizeDetails should be a valid javaScript object type")
	}

	const productService = await service({ serviceId })
	if(!productService) {
		throw new Error("Bunday xizmat turi mavjud emas!")
	} else if(
		!productService?.service_unit_keys?.map(key => {
			return Object.keys(productSizeDetails).includes(key) && typeof(productSizeDetails[key]) === 'number'
		}).every(el => el ===  true)
	) {
		throw new Error(`The keys ${productService?.service_unit_keys} must be present inside productSizeDetails and they should be number!`)
	}

	const productOrder = await order({ orderId })
	if(productOrder && productOrder.branch_id != productService.branch_id) {
		throw new Error("Bu xizmat buyurtma berilgan filialda ishlamaydi!")
	}

	const productSize = Object.values(productSizeDetails).reduce((acc, el) => acc * el)

	return fetch(ProductQuery.ADD_PRODUCT, orderId, serviceId, file, productSizeDetails, productSize, productSummary, staffId)
}

export default {
	productStatuses,
	addProduct,
	products,
	service,
	order,
}
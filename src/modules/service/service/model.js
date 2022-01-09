import { fetch, fetchAll } from '#utils/postgres'
import ServiceQuery from '#sql/service'
import BranchQuery from '#sql/branch'

const services = ({ isDeleted, serviceId, branchId }) => {
	return fetchAll(ServiceQuery.SERVICES, isDeleted, serviceId, branchId)
}

const branch = ({ branchId }) => {
	return fetch(BranchQuery.BRANCHES, branchId)
}

const deliveryHours = ({ branchId }) => {
	return fetchAll(ServiceQuery.DELIVERY_HOURS, branchId)
}

const addService = ({ 
	branchId, 
	serviceName, 
	serviceUnit, 
	serviceUnitKeys, 
	servicePriceSpecial, 
	servicePriceSimple 
}) => {
	return fetch(
		ServiceQuery.ADD_SERVICE, branchId, serviceName, serviceUnit, serviceUnitKeys, 
		servicePriceSpecial, servicePriceSimple
	)
}

const changeService = ({ 
	serviceId, 
	branchId, 
	serviceName, 
	serviceUnit, 
	serviceUnitKeys, 
	servicePriceSpecial, 
	servicePriceSimple 
}) => {
	return fetch(
		ServiceQuery.CHANGE_SERVICE, serviceId, branchId, serviceName, serviceUnit, 
		serviceUnitKeys, servicePriceSpecial, servicePriceSimple
	)
}

const disableService = ({ serviceId }) => {
	return fetchAll(ServiceQuery.DISABLE_SERVICE, serviceId, false)
}

const enableService = ({ serviceId }) => {
	return fetchAll(ServiceQuery.DISABLE_SERVICE, serviceId, true)
}

const changeDeliveryHour = ({ deliveryHourId, deliveryHourSpecial, deliveryHourSimple }) => {
	return fetch(ServiceQuery.CHANGE_DELIVERY_HOUR, deliveryHourId, deliveryHourSpecial, deliveryHourSimple)
}


export default {
	changeDeliveryHour,
	disableService,
	enableService,
	deliveryHours,
	changeService,
	addService,
	services,
	branch
}
import { setMonitoring } from '#helpers/monitoring'
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

const addService = async ({ 
	branchId, 
	serviceName, 
	serviceUnit, 
	serviceUnitKeys, 
	servicePriceSpecial, 
	servicePriceSimple 
}, { userId }) => {
	const newService = await fetch(
		ServiceQuery.ADD_SERVICE, branchId, serviceName, serviceUnit, serviceUnitKeys, 
		servicePriceSpecial, servicePriceSimple
	)

	if(newService) setMonitoring({ 
		userId, 
		sectionId: newService.service_id,
		sectionName: 'services', 
		operationType: 'added',
		branchId,
	}, newService)

	return newService
}

const changeService = async ({ 
	serviceId, 
	branchId, 
	serviceName, 
	serviceUnit, 
	serviceUnitKeys, 
	servicePriceSpecial, 
	servicePriceSimple 
}, { userId }) => {
	const updatedService = await fetch(
		ServiceQuery.CHANGE_SERVICE, serviceId, branchId, serviceName, serviceUnit, 
		serviceUnitKeys, servicePriceSpecial, servicePriceSimple
	)

	if(updatedService) setMonitoring({ 
		userId, 
		sectionId: updatedService.service_id,
		sectionName: 'services', 
		operationType: 'changed',
		branchId: updatedService.old_branch_id,
	}, updatedService)

	return updatedService
}

const disableService = async ({ serviceId }, { userId }) => {
	const disabledServices = await fetchAll(ServiceQuery.DISABLE_SERVICE, serviceId, false)

	disabledServices.map(service => {
		setMonitoring({ 
			userId, 
			sectionId: service.service_id,
			sectionName: 'services', 
			operationType: 'deleted',
			branchId: service.branch_id,
		}, service)
	})

	return disabledServices
}

const enableService = async ({ serviceId }, { userId }) => {
	const enabledServices = await fetchAll(ServiceQuery.DISABLE_SERVICE, serviceId, true)
	
	enabledServices.map(service => {
		setMonitoring({ 
			userId, 
			sectionId: service.service_id,
			sectionName: 'services', 
			operationType: 'restored',
			branchId: service.branch_id,
		}, service)
	}) 

	return enabledServices
}

const changeDeliveryHour = async ({ deliveryHourId, deliveryHourSpecial, deliveryHourSimple }, { userId }) => {
	const updatedDeliveryHour = await fetch(ServiceQuery.CHANGE_DELIVERY_HOUR, deliveryHourId, deliveryHourSpecial, deliveryHourSimple)

	if(updatedDeliveryHour)	setMonitoring({ 
		userId, 
		sectionId: deliveryHourId,
		sectionName: 'settings', 
		operationType: 'changed',
		branchId: updatedDeliveryHour.branch_id,
	}, updatedDeliveryHour)

	return updatedDeliveryHour
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
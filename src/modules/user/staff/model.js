import { checkUserInfo, checkContact, checkAddress } from '#helpers/checkInput'
import { setMonitoring } from '#helpers/monitoring'
import { fetch, fetchAll } from '#utils/postgres'
import code from '#helpers/randomNumberGenerator'
import StaffQuery from '#sql/staff'
import UserQuery from '#sql/user'


const staffs = ({ isDeleted, sort, search, staffId, pagination, addressFilter, userInfoFilter }, user) => {
	let { page, limit } = pagination
	let { age, gender, branchId } = userInfoFilter
	let { stateId, regionId, neighborhoodId, streetId, areaId } = addressFilter
	let sortNameValues = { firstName: 1, lastName: 2, age: 3, userId: 4, userCreatedAt: 5 }

	let sortObject = Object.keys(sort).map( key => {
		if(sort[key]) {
			return { sortKey: sortNameValues[key], value: sort[key] }
		}
	}).filter(elem => elem !== undefined)[0]
	
	branchId = Array.prototype.equalize(branchId, user.allowedBranches)

	return fetchAll(
		StaffQuery.STAFFS,
		(page - 1) * limit, limit, isDeleted,
		staffId, [age?.from || 0, age?.to || 0], gender, branchId, search,
		stateId, regionId, neighborhoodId, streetId, areaId,
		sortObject?.sortKey || 4, sortObject?.value || 1
	)
}

const user = ({ userId }) => {
	return fetch(UserQuery.USERS, userId)
}

const addStaff = async ({ mainContact, password, branchId, file, staffSummary, userAddress, userInfo }) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target } = userAddress
	const { firstName, lastName, secondContact, birthDate, gender } = userInfo

	await checkContact(mainContact)
	await checkUserInfo(userInfo)
	await checkAddress(userAddress)

	return fetch(
		StaffQuery.ADD_STAFF,
		stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target,
		mainContact, password, secondContact, firstName, lastName, birthDate, gender, branchId,
		file, staffSummary
	)
}

const changeStaff = async ({ staffId, password, branchId, file, staffSummary, userInfo, userAddress = {} }, user) => {
	const { stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target } = userAddress
	const { firstName, lastName, mainContact, secondContact, birthDate, gender } = userInfo
	
	await checkContact(mainContact)
	await checkAddress(userAddress)

	const updatedStaff = await fetch(
		StaffQuery.CHANGE_STAFF, staffId, Boolean(Object.keys(userAddress).length),
		stateId, regionId, neighborhoodId, streetId, areaId, homeNumber, target,
		mainContact, password, secondContact, firstName, lastName, birthDate, gender, branchId,
		file, staffSummary
	)

	if(updatedStaff) setMonitoring({ 
		userId: user.userId, 
		sectionId: staffId,
		sectionName: 'staffs', 
		operationType: 'changed',
		branchId: updatedStaff.old_branch_id,
	}, updatedStaff)

	return updatedStaff
}

const deleteStaff = async ({ staffId }, user) => {
	const deletedStaffs = []
	for(let id of staffId) {
		const deletedStaff = await fetch(StaffQuery.DELETE_STAFF, id)
		if(deletedStaff) {
			deletedStaffs.push(deletedStaff)

			setMonitoring({ 
				userId: user.userId, 
				sectionId: id,
				sectionName: 'staffs', 
				operationType: 'deleted',
				branchId: deletedStaff.branch_id,
			}, deletedStaff)
		} 
	}
	return deletedStaffs
}

const restoreStaff = async ({ staffId }, user) => {
	const restoredStaffs = []
	for(let id of staffId) {
		const restoredStaff = await fetch(StaffQuery.RESTORE_STAFF, id)
		if(restoredStaff) {
			restoredStaffs.push(restoredStaff)

			setMonitoring({ 
				userId: user.userId, 
				sectionId: id,
				sectionName: 'staffs', 
				operationType: 'restored',
				branchId: restoredStaff.branch_id,
			}, restoredStaff)
		}
	}
	return restoredStaffs
}

const loginStaff = ({ mainContact, password }) => {
	return fetch(StaffQuery.LOGIN_STAFF, mainContact, password)
}

export default {
	restoreStaff,
	deleteStaff,
	changeStaff,
	loginStaff,
	addStaff,
	staffs,
	user
}
import { fetch, fetchAll } from '#utils/postgres'
import PermissionQuery from '#sql/permission'

const permissionsList = () => {
	return fetchAll(PermissionQuery.PERMISSIONS)
}

const permissionsUser = ({ staffId }) => {
	return fetchAll(PermissionQuery.BRANCHES_BY_USER, staffId)
}

const permissionGroups = ({ groupId }) => {
	return fetchAll(PermissionQuery.PERMISSION_GROUPS, groupId)
}

const permissionsByGroup = ({ groupId }) => {
	return fetchAll(PermissionQuery.PERMISSIONS_BY_GROUP, groupId)
}

const permissionsByBranch = ({ branchId, staffId }) => {
	return fetchAll(PermissionQuery.PERMISSIONS_BY_BRANCH, branchId, staffId)
}

const deletePermissionGroup = ({ groupId }) => {
	return fetch(PermissionQuery.DELETE_PERMISSION_GROUP, groupId)
}

const deletePermission = async ({ staffId, permissionKeys, branchId }) => {
	const data = await Promise.all(
		permissionKeys.map(async key => {
			return await fetch(PermissionQuery.DELETE_PERMISSION, staffId, key, branchId)
		})
	)
	return data.filter(el => el)
}

const addPermission = async ({ staffId, permissionKeys, branchId }) => {
	await deletePermission({ staffId, permissionKeys, branchId })
	const data = await Promise.all(
		permissionKeys.map(async key => {
			return await fetch(PermissionQuery.ADD_PERMISSION, staffId, key, branchId)
		})
	)

	return data.filter(el => el)
}

const addPermissionGroup = async ({ groupName, permissionKeys }) => {
	const newGroup = await fetch(PermissionQuery.ADD_PERMISSION_GROUP, groupName)
	const data = await Promise.all(
		permissionKeys.map(async key => {
			return await fetch(PermissionQuery.ADD_PERMISSION_GROUP_ACTIONS, newGroup.group_id, key)
		})
	)
	
	return newGroup
}

const editPermissionGroup = async ({ groupId, groupName, permissionKeys = [] }) => {
	const group = await fetch(PermissionQuery.EDIT_PERMISSION_GROUP, groupId, groupName)
	permissionKeys.length && await fetch(PermissionQuery.DELETE_PERMISSION_GROUP_ACTIONS, groupId)
	permissionKeys.map(async key => {
		await fetch(PermissionQuery.ADD_PERMISSION_GROUP_ACTIONS, groupId, key)
	})

	return group
}


export default {
	deletePermissionGroup,
	editPermissionGroup,
	permissionsByBranch,
	permissionsByGroup,
	addPermissionGroup,
	permissionGroups,
	deletePermission,
	permissionsUser,
	permissionsList,
	addPermission
}
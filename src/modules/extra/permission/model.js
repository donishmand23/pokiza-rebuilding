import { fetch, fetchAll } from '#utils/postgres'
import PermissionQuery from '#sql/permission'

const permissionsList = () => {
	return fetchAll(PermissionQuery.PERMISSIONS)
}

const permissionsUser = ({ staffId }, user) => {
	return fetchAll(PermissionQuery.BRANCHES_BY_USER, staffId, user.allowedBranches)
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

const addPermission = async ({ staffId, permissionKeys, branchId }) => {
	await fetchAll(PermissionQuery.DELETE_ALL_PERMISSIONS, staffId, branchId)
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

const changePermissionGroup = async ({ groupId, groupName, permissionKeys = [] }) => {
	const group = await fetch(PermissionQuery.EDIT_PERMISSION_GROUP, groupId, groupName)
	permissionKeys.length && await fetch(PermissionQuery.DELETE_PERMISSION_GROUP_ACTIONS, groupId)
	permissionKeys.map(async key => {
		await fetch(PermissionQuery.ADD_PERMISSION_GROUP_ACTIONS, groupId, key)
	})

	return group
}


export default {
	deletePermissionGroup,
	changePermissionGroup,
	permissionsByBranch,
	permissionsByGroup,
	addPermissionGroup,
	permissionGroups,
	permissionsUser,
	permissionsList,
	addPermission
}

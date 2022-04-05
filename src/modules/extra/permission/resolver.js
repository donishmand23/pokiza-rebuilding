import permissionModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addPermission: async (_, args, user) => {
			try {
				const newPermission = await permissionModel.addPermission(args, user)
				if(newPermission.length) {
					return {
						status: 200,
						message: "Xodimga yangi ruxsatnoma(lar) biriktirildi!",
						data: newPermission
					}
				} else throw "Xodimga ruxsatnoma(lar) biriktirishda muammolik yuz berdi!"
			} catch(error) { 
				if(error.message.includes('unique constraint')) {
					return mError(new Error("Ushbu ruxsatnoma(lar) allqachon qo'shilgan!")) 
				}
				if (error.message.includes('foreign key constraint')) {
					return mError(new Error("Bunday ruxsatnomalar mavjud emas!")) 
				}
				return mError(error) 
			}
		},

		deletePermission: async (_, args, user) => {
			try {
				const deletedPermissions = await permissionModel.deletePermission(args, user)
				if(deletedPermissions.length) {
					return {
						status: 200,
						message: "Xodimdan rixsatnoma(lar) olib tashlandi!",
						data: deletedPermissions
					}
				} else throw "Xodimdan ruxsatnoma(lar) allaqachon olib tashlangan!"
			} catch(error) { return mError(error) }
		},

		addPermissionGroup: async (_, args, user) => {
			try {
				const newPermissionGroup = await permissionModel.addPermissionGroup(args, user)
				if(newPermissionGroup) {
					return {
						status: 200,
						message: "Yangi ruxsatnomlar guruhi qo'shildi!",
						data: newPermissionGroup
					}
				} else throw "Ruxsatnomalar guruhini qo'shishda muammolik yuz berdi!"
			} catch(error) { return mError(error) }
		},

		deletePermissionGroup: async (_, args, user) => {
			try {
				const deletedPermissionGroup = await permissionModel.deletePermissionGroup(args, user)
				if(deletedPermissionGroup) {
					return {
						status: 200,
						message: "Ruxsatnomalar guruhi o'chirib tashlandi!",
						data: deletedPermissionGroup
					}
				} else throw "Ruxsatnomalar guruhi allaqachon o'chirilgan!"
			} catch(error) { return mError(error) }
		},

		changePermissionGroup: async (_, args, user) => {
			try {
				const editedPermissionGroup = await permissionModel.changePermissionGroup(args, user)
				if(editedPermissionGroup) {
					return {
						status: 200,
						message: "Ruxsatnomalar guruhi yangilandi!",
						data: editedPermissionGroup
					}
				} else throw "Bunday ruxsatnomlar guruhi mavjud emas!"
			} catch(error) { return mError(error) }
		},

	},
	Query: {
		permissionsList: async (_, args, user) => {
			try {
				const permissionsList = await permissionModel.permissionsList(args, user)
				return permissionsList
			} catch (error) {
				throw error
			}
		},

		permissionsUser: async (_, args, user) => {
			try {
				const permissionsUser = await permissionModel.permissionsUser(args, user)
				return permissionsUser
			} catch (error) {
				throw error
			}
		},
		
		permissionGroups: async (_, args, user) => {
			try {
				const permissionGroups = await permissionModel.permissionGroups(args, user)
				return permissionGroups
			} catch (error) {
				throw error
			}
		},
	},

	Permission: {
		permissionAction: global  => global.permission_action,
		permissionModel:  global  => global.permission_model,
	},

	PermissionGroup: {
		groupId:               global => global.group_id,
		groupName:             global => global.group_name,
		permissionsList: async global => await permissionModel.permissionsByGroup({ groupId: global.group_id })
	},

	BranchPermission: {
		branchId:        	   global => global.branch_id,
		branchName:      	   global => global.branch_name,
		permissionsList: async global => await permissionModel.permissionsByBranch({ branchId: global.branch_id, staffId: global.staff_id })
	}
}

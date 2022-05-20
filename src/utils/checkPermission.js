import { fetch, fetchAll } from '#utils/postgres'
import PermissionQuery from '#sql/permission'
import UserQuery from '#sql/user'
import permissions from '../permissions.js'

/*
    queryName
    permissions to query
    branchId
    arguments
*/

export default async ({ operation, variables, fieldName }, payload) => {
    const query = fieldName.trim()
    const queryPermissions = permissions[query]
    const staffPermissions = await fetchAll(PermissionQuery.PERMISSION_SETS, payload.staffId || 0, queryPermissions)

    if (operation === 'query') {
        payload.allowedBranches = []

        if (payload.staffId && staffPermissions.length) {
            payload.allowedBranches = staffPermissions.map(per => per.branch_id)
        }

        if (payload.clientId) {
            const { branch_id } = await fetch(UserQuery.USER_BRANCH, payload.userId)
            payload.allowedBranches = [ branch_id ]
        }

        return
    }

    if (operation === 'mutation' && Object.keys(variables).length) {
        console.log('variables:', variables)

        // staff only queries
        if (query === 'addStaff') {
            if (!staffPermissions.length) throw new Error("Siz uchun ruxsatnoma berilmagan!")
            let allowedBranches = staffPermissions.map(per => +per.branch_id)

            const branchId = variables.branchId               // ID
            const regionId = variables.userAddress.regionId   // ID

            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id

            if (!regionBranchId) {
                throw new Error("Bunday tuman mavjud emas!")
            }

            if (
                !allowedBranches.includes(+branchId) ||
                !allowedBranches.includes(+regionBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'changeStaff') {
            if (!staffPermissions.length) throw new Error("Siz uchun ruxsatnoma berilmagan!")
            let allowedBranches = staffPermissions.map(per => +per.branch_id)

            const staffId = variables?.staffId                  // ID
            const branchId = variables?.branchId                // ID
            const regionId = variables?.userAddress?.regionId   // ID

            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id
            const staffBranchId = (await fetch(PermissionQuery.BRANCHES_BY_STAFFS, [staffId]))?.branch_id

            if (regionId && !regionBranchId) {
                throw new Error("Bunday tuman mavjud emas!")
            }

            if (staffId && !staffBranchId) {
                throw new Error("Bunday xodim mavjud emas!")
            }

            if (
                staffBranchId && !allowedBranches.includes(+staffBranchId) ||
                branchId && !allowedBranches.includes(+branchId) ||
                regionId && !allowedBranches.includes(+regionBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'deleteStaff' || query === 'restoreStaff') {
            if (!staffPermissions.length) throw new Error("Siz uchun ruxsatnoma berilmagan!")
            let allowedBranches = staffPermissions.map(per => +per.branch_id)

            const staffId = variables.staffId                  // [ID!]

            const staffBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_STAFFS, staffId)).map(el => +el.branch_id)

            if (
                !staffBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }
    }   

}
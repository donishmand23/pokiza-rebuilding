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

        // if client sends a mutatation request return it
        if(payload.clientId) return

        // staff only queries
        // check staff has permissions
        if (!staffPermissions.length) throw new Error("Siz uchun ruxsatnoma berilmagan!")
        const allowedBranches = staffPermissions.map(per => +per.branch_id)
        
        // staff module
        if (query === 'addStaff') {
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
            const staffId = variables.staffId                  // [ID!]

            const staffBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_STAFFS, staffId)).map(el => +el.branch_id)

            if (
                !staffBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // client module
        if (query === 'addClient') {
            const regionId = variables.userAddress.regionId   // ID

            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id

            if (!regionBranchId) {
                throw new Error("Bunday tuman mavjud emas!")
            }
            
            if (
                !allowedBranches.includes(+regionBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'changeClient') {
            const clientId = variables?.clientId                  // ID
            const regionId = variables?.userAddress?.regionId     // ID

            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id
            const clientBranchId = (await fetch(PermissionQuery.BRANCHES_BY_CLIENTS, [clientId]))?.branch_id

            if (regionId && !regionBranchId) {
                throw new Error("Bunday tuman mavjud emas!")
            }

            if (clientId && !clientBranchId) {
                throw new Error("Bunday xodim mavjud emas!")
            }

            if (
                clientBranchId && !allowedBranches.includes(+clientBranchId) ||
                regionId && !allowedBranches.includes(+regionBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'deleteClient' || query === 'restoreClient') {
            const clientId = variables.clientId                  // [ID!]

            const clientBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_CLIENTS, clientId)).map(el => +el.branch_id)

            if (
                !clientBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // transport module
        if (query === 'addTransport') {
            const branchId = variables.branchId               // ID

            if (
                !allowedBranches.includes(+branchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'changeTransport') {
            const transportId = variables.transportId               // ID
            const branchId = variables.branchId                     // ID

            const transportBranchId = (await fetch(PermissionQuery.BRANCHES_BY_TRANSPORTS, [transportId]))?.branch_id

            if (transportId && !transportBranchId) {
                throw new Error("Bunday transport mavjud emas!")
            }

            if (
                transportBranchId && !allowedBranches.includes(+transportBranchId) ||
                branchId && !allowedBranches.includes(+branchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'bindOrder') {
            const transportId = variables.transportId               // ID
            const productId = variables.productId                   // [ID!]
            const orderId = variables.orderId                       // [ID!]

            const transportBranchId = (await fetch(PermissionQuery.BRANCHES_BY_TRANSPORTS, [transportId]))?.branch_id
            const orderBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_ORDERS, orderId)).map(el => +el.branch_id)
            const productBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_PRODUCTS, productId)).map(el => +el.branch_id)

            if (transportId && !transportBranchId) {
                throw new Error("Bunday transport mavjud emas!")
            }

            if (
                transportBranchId && !allowedBranches.includes(+transportBranchId) ||
                !orderBranchIds.every(branchId => allowedBranches.includes(+branchId)) ||
                !productBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'unbindOrder') {
            const productId = variables.productId                   // [ID!]
            const orderId = variables.orderId                       // [ID!]

            const orderBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_ORDERS, orderId)).map(el => +el.branch_id)
            const productBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_PRODUCTS, productId)).map(el => +el.branch_id)

            if (
                !orderBranchIds.every(branchId => allowedBranches.includes(+branchId)) ||
                !productBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'registerTransport') {
            const staffId = variables.staffId                               // ID!
            const transportId = variables.transportId                       // ID!

            const transportBranchId = (await fetch(PermissionQuery.BRANCHES_BY_TRANSPORTS, [transportId]))?.branch_id
            const staffBranchId = (await fetch(PermissionQuery.BRANCHES_BY_STAFFS, [staffId]))?.branch_id

            if (!transportBranchId) {
                throw new Error("Bunday transport mavjud emas!")
            }

            if (!staffBranchId) {
                throw new Error("Bunday xodim mavjud emas!")
            }

            if (
                transportBranchId && !allowedBranches.includes(+transportBranchId) ||
                staffBranchId && !allowedBranches.includes(+staffBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'unregisterTransport') {
            const transportId = variables.transportId                       // ID!

            const transportBranchId = (await fetch(PermissionQuery.BRANCHES_BY_TRANSPORTS, [transportId]))?.branch_id

            if (!transportBranchId) {
                throw new Error("Bunday transport mavjud emas!")
            }

            if (
                transportBranchId && !allowedBranches.includes(+transportBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        if (query === 'deleteTransport' || query === 'restoreTransport') {
            const transportId = variables.transportId                  // [ID!]

            const transportBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_TRANSPORTS, transportId)).map(el => +el.branch_id)

            if (
                !transportBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }
    }   

}
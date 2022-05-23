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
        // permissions that are not relevant to branches
        if (['changeDeliveryHour'].includes(query)) return
        
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

        else if (query === 'changeStaff') {
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

        else if (query === 'deleteStaff' || query === 'restoreStaff') {
            const staffId = variables.staffId                  // [ID!]

            const staffBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_STAFFS, staffId)).map(el => +el.branch_id)

            if (
                !staffBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // client module
        else if (query === 'addClient') {
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

        else if (query === 'changeClient') {
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

        else if (query === 'deleteClient' || query === 'restoreClient') {
            const clientId = variables.clientId                  // [ID!]

            const clientBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_CLIENTS, clientId)).map(el => +el.branch_id)

            if (
                !clientBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // transport module
        else if (query === 'addTransport') {
            const branchId = variables.branchId               // ID

            if (
                !allowedBranches.includes(+branchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeTransport') {
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

        else if (query === 'bindOrder') {
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

        else if (query === 'unbindOrder') {
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

        else if (query === 'registerTransport') {
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

        else if (query === 'unregisterTransport') {
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

        else if (query === 'deleteTransport' || query === 'restoreTransport') {
            const transportId = variables.transportId                  // [ID!]

            const transportBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_TRANSPORTS, transportId)).map(el => +el.branch_id)

            if (
                !transportBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // service module
        else if (query === 'addService') {
            const branchId = variables.branchId               // ID

            if (
                !allowedBranches.includes(+branchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeService') {
            const serviceId = variables.serviceId               // ID
            const branchId = variables.branchId                 // ID

            const serviceBranchId = (await fetch(PermissionQuery.BRANCHES_BY_SERVICES, [serviceId]))?.branch_id

            if (serviceId && !serviceBranchId) {
                throw new Error("Bunday xizmat mavjud emas!")
            }

            if (
                serviceBranchId && !allowedBranches.includes(+serviceBranchId) ||
                branchId && !allowedBranches.includes(+branchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'disableService' || query === 'enableService') {
            const serviceId = variables.serviceId                  // [ID!]

            const serviceBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_SERVICES, serviceId)).map(el => +el.branch_id)

            if (
                !serviceBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // products module
        else if (query === 'addProduct') {
            const orderId = variables.orderId               // ID!
            const serviceId = variables.serviceId           // ID!

            const orderBranchId = (await fetch(PermissionQuery.BRANCHES_BY_ORDERS, [orderId]))?.branch_id
            const serviceBranchId = (await fetch(PermissionQuery.BRANCHES_BY_SERVICES, [serviceId]))?.branch_id

            if (!orderBranchId) {
                throw new Error("Bunday buyum mavjud emas!")
            }

            if (!serviceBranchId) {
                throw new Error("Bunday xizmat mavjud emas!")
            }

            if (
                !allowedBranches.includes(+orderBranchId) ||
                !allowedBranches.includes(+serviceBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeProduct') {
            const productId = variables.productId           // ID!
            const serviceId = variables.serviceId           // ID

            const productBranchId = (await fetch(PermissionQuery.BRANCHES_BY_PRODUCTS, [productId]))?.branch_id
            const serviceBranchId = (await fetch(PermissionQuery.BRANCHES_BY_SERVICES, [serviceId]))?.branch_id

            if (!productBranchId) {
                throw new Error("Bunday buyum mavjud emas!")
            }

            if (serviceId && !serviceBranchId) {
                throw new Error("Bunday xizmat mavjud emas!")
            }

            if (
                productId && !allowedBranches.includes(+productBranchId) ||
                serviceId && !allowedBranches.includes(+serviceBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }
            
        else if (query === 'changeProductStatus') {
            const productStatusPermissions = {
                1: 2201,
                2: 2202,
                3: 2203,
                4: 2204,
                5: 2205,
                6: 2206,
                7: 2207,
                8: 2208,
                9: 2209,
                10: 2210,
            }

            const productId = variables.productId               // ID!
            const status = variables.status                     // Status!

            const staffPermissions = await fetchAll(PermissionQuery.PERMISSION_SETS, payload.staffId || 0, [productStatusPermissions[status]])
            const allowedBranches = staffPermissions.map(per => +per.branch_id)

            const productBranchId = (await fetch(PermissionQuery.BRANCHES_BY_PRODUCTS, [productId]))?.branch_id

            if (!productBranchId) {
                throw new Error("Bunday buyum mavjud emas!")
            }
            if (
                !allowedBranches.includes(+productBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'deleteProduct' || query === 'restoreProduct') {
            const productId = variables.productId                  // [ID!]

            const productBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_PRODUCTS, productId)).map(el => +el.branch_id)

            if (
                !productBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // orders module
        else if (query === 'addOrder') {
            const clientId = variables.clientId                       // ID
            const regionId = variables.address.regionId               // ID!

            const clientBranchId = (await fetch(PermissionQuery.BRANCHES_BY_CLIENTS, [clientId]))?.branch_id
            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id

            if (
                clientId && !allowedBranches.includes(+clientBranchId) ||
                regionId && !allowedBranches.includes(+regionBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeOrder') {
            const orderId = variables.orderId                // ID!
            const regionId = variables.address?.regionId     // ID

            const orderBranchId = (await fetch(PermissionQuery.BRANCHES_BY_ORDERS, [orderId]))?.branch_id
            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id

            if (!orderBranchId) {
                throw new Error("Bunday buyurtma mavjud emas!")
            }

            if (
                orderId && !allowedBranches.includes(+orderBranchId) ||
                regionId && !allowedBranches.includes(+regionBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeOrderStatus') {
            const orderStatusPermissions = {
                1: 2101,
                2: 2102,
                3: 2103,
                4: 2104,
                5: 2105,
                6: 2106,
                7: 2107,
                8: 2108,
                9: 2109,
                10: 2110,
            }

            const orderId = variables.orderId               // ID!
            const status = variables.status                 // Status!

            const staffPermissions = await fetchAll(PermissionQuery.PERMISSION_SETS, payload.staffId || 0, [orderStatusPermissions[status]])
            const allowedBranches = staffPermissions.map(per => +per.branch_id)

            const orderBranchId = (await fetch(PermissionQuery.BRANCHES_BY_ORDERS, [orderId]))?.branch_id

            if (!orderBranchId) {
                throw new Error("Bunday buyurtma mavjud emas!")
            }

            if (
                !allowedBranches.includes(+orderBranchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'deleteOrder' || query === 'restoreOrder') {
            const orderId = variables.orderId                  // [ID!]

            const orderBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_ORDERS, orderId)).map(el => +el.branch_id)

            if (
                !orderBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // permissions module
        else if (query === 'addPermission' || query === 'deletePermission') {
            const staffId = variables.staffId                  // ID!
            const branchId = variables.branchId                // ID!

            const staffBranchId = (await fetch(PermissionQuery.BRANCHES_BY_STAFFS, [staffId]))?.branch_id
            console.log(allowedBranches)
            if (
                !allowedBranches.includes(+staffBranchId) ||
                !allowedBranches.includes(+branchId)
            ) {
                throw new Error("Siz uchun ruxsatnoma berilmagan!")
            }
        }

    }   

}
import { ForbiddenError, BadRequestError } from '#errors'
import { fetch, fetchAll } from '#utils/postgres'
import permissions from '../permissions.js'
import OrderTransactionQuery from '#sql/orderTransaction'
import DebtTransactionQuery from '#sql/debtTransaction'
import PermissionQuery from '#sql/permission'
import OrderQuery from '#sql/order'
import UserQuery from '#sql/user'

const personalPermissions = {
    2400: "see personal balances",
    2500: "see personal order transactions",
    2502: "make personal order transactions",
    2504: "change personal order transactions",
    2506: "delete personal order transactions",

    2600: "see personal equities",
    2603: "see personal debt transactions",
    2605: "make personal debt transaction income",
    2607: "make personal debt transaction outcome",
    2609: "accept personal debt transaction",
    2611: "cancel personal debt transaction",
    2613: "change personal debt transaction",
    2615: "delete personal debt transaction",
}

export default async ({ operation, variables, fieldName }, payload) => {
    const query = fieldName.trim()
    const queryPermissions = permissions[query]
    const staffPermissions = await fetchAll(PermissionQuery.PERMISSION_SETS, payload.staffId || 0, queryPermissions)
    
    if (staffPermissions.length == 1 && personalPermissions[staffPermissions[0]?.permission_action]) {
        payload.personal = true
        payload.personalBranchId = [staffPermissions[0].branch_id]
    } else if (staffPermissions.length > 1 && staffPermissions.find(per => personalPermissions[per.permission_action])) {
        const personalPermissionIndexes = staffPermissions.filter(per => {
            return personalPermissions[per.permission_action] &&
            staffPermissions.filter(innerPer => innerPer.permission_set_id != per.permission_set_id).map(per => +per.branch_id).includes(+per.branch_id)
        }).map((_, index) => +index)

        if (personalPermissionIndexes.length) {
            personalPermissionIndexes.map(index => staffPermissions.splice(index, 1))
        }

        const personalBranchId = staffPermissions.filter(per => personalPermissions[per.permission_action]).map(per => +per.branch_id)
        
        if (personalBranchId.length) {
            payload.personal = true
            payload.personalBranchId = personalBranchId
        } else {
            payload.personal = false
        }
    } else {
        payload.personal = false
    }

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
        if (!staffPermissions.length) throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
        const allowedBranches = staffPermissions.map(per => +per.branch_id)
        // permissions that are not relevant to branches
        if (['changeDeliveryHour'].includes(query)) return
        
        // staff module
        if (query === 'addStaff') {
            const branchId = variables.branchId               // ID
            const regionId = variables.userAddress.regionId   // ID

            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id

            if (!regionBranchId) {
                throw new BadRequestError("Bunday tuman mavjud emas!")
            }

            if (
                !allowedBranches.includes(+branchId) ||
                !allowedBranches.includes(+regionBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeStaff') {
            const staffId = variables?.staffId                  // ID
            const branchId = variables?.branchId                // ID
            const regionId = variables?.userAddress?.regionId   // ID

            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id
            const staffBranchId = (await fetch(PermissionQuery.BRANCHES_BY_STAFFS, [staffId]))?.branch_id

            if (regionId && !regionBranchId) {
                throw new BadRequestError("Bunday tuman mavjud emas!")
            }

            if (staffId && !staffBranchId) {
                throw new BadRequestError("Bunday xodim mavjud emas!")
            }
            
            if (
                staffBranchId && !allowedBranches.includes(+staffBranchId) ||
                branchId && !allowedBranches.includes(+branchId) ||
                regionId && !allowedBranches.includes(+regionBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'deleteStaff' || query === 'restoreStaff') {
            const staffId = variables.staffId                  // [ID!]

            const staffBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_STAFFS, staffId)).map(el => +el.branch_id)

            if (
                !staffBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // client module
        else if (query === 'addClient') {
            const regionId = variables.userAddress.regionId   // ID

            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id

            if (!regionBranchId) {
                throw new BadRequestError("Bunday tuman mavjud emas!")
            }
            
            if (
                !allowedBranches.includes(+regionBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeClient') {
            const clientId = variables?.clientId                  // ID
            const regionId = variables?.userAddress?.regionId     // ID

            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id
            const clientBranchId = (await fetch(PermissionQuery.BRANCHES_BY_CLIENTS, [clientId]))?.branch_id

            if (regionId && !regionBranchId) {
                throw new BadRequestError("Bunday tuman mavjud emas!")
            }

            if (clientId && !clientBranchId) {
                throw new BadRequestError("Bunday xodim mavjud emas!")
            }

            if (
                clientBranchId && !allowedBranches.includes(+clientBranchId) ||
                regionId && !allowedBranches.includes(+regionBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'deleteClient' || query === 'restoreClient') {
            const clientId = variables.clientId                  // [ID!]

            const clientBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_CLIENTS, clientId)).map(el => +el.branch_id)

            if (
                !clientBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // transport module
        else if (query === 'addTransport') {
            const branchId = variables.branchId               // ID

            if (
                !allowedBranches.includes(+branchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeTransport') {
            const transportId = variables.transportId               // ID
            const branchId = variables.branchId                     // ID

            const transportBranchId = (await fetch(PermissionQuery.BRANCHES_BY_TRANSPORTS, [transportId]))?.branch_id

            if (transportId && !transportBranchId) {
                throw new BadRequestError("Bunday transport mavjud emas!")
            }

            if (
                transportBranchId && !allowedBranches.includes(+transportBranchId) ||
                branchId && !allowedBranches.includes(+branchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
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
                throw new BadRequestError("Bunday transport mavjud emas!")
            }

            if (
                transportBranchId && !allowedBranches.includes(+transportBranchId) ||
                !orderBranchIds.every(branchId => allowedBranches.includes(+branchId)) ||
                !productBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
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
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'registerTransport') {
            const staffId = variables.staffId                               // ID!
            const transportId = variables.transportId                       // ID!

            const transportBranchId = (await fetch(PermissionQuery.BRANCHES_BY_TRANSPORTS, [transportId]))?.branch_id
            const staffBranchId = (await fetch(PermissionQuery.BRANCHES_BY_STAFFS, [staffId]))?.branch_id

            if (!transportBranchId) {
                throw new BadRequestError("Bunday transport mavjud emas!")
            }

            if (!staffBranchId) {
                throw new BadRequestError("Bunday xodim mavjud emas!")
            }

            if (
                transportBranchId && !allowedBranches.includes(+transportBranchId) ||
                staffBranchId && !allowedBranches.includes(+staffBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'unregisterTransport') {
            const transportId = variables.transportId                       // ID!

            const transportBranchId = (await fetch(PermissionQuery.BRANCHES_BY_TRANSPORTS, [transportId]))?.branch_id

            if (!transportBranchId) {
                throw new BadRequestError("Bunday transport mavjud emas!")
            }

            if (
                transportBranchId && !allowedBranches.includes(+transportBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'deleteTransport' || query === 'restoreTransport') {
            const transportId = variables.transportId                  // [ID!]

            const transportBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_TRANSPORTS, transportId)).map(el => +el.branch_id)

            if (
                !transportBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // service module
        else if (query === 'addService') {
            const branchId = variables.branchId               // ID

            if (
                !allowedBranches.includes(+branchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeService') {
            const serviceId = variables.serviceId               // ID
            const branchId = variables.branchId                 // ID

            const serviceBranchId = (await fetch(PermissionQuery.BRANCHES_BY_SERVICES, [serviceId]))?.branch_id

            if (serviceId && !serviceBranchId) {
                throw new BadRequestError("Bunday xizmat mavjud emas!")
            }

            if (
                serviceBranchId && !allowedBranches.includes(+serviceBranchId) ||
                branchId && !allowedBranches.includes(+branchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'disableService' || query === 'enableService') {
            const serviceId = variables.serviceId                  // [ID!]

            const serviceBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_SERVICES, serviceId)).map(el => +el.branch_id)

            if (
                !serviceBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // products module
        else if (query === 'addProduct') {
            const orderId = variables.orderId               // ID!
            const serviceId = variables.serviceId           // ID!

            const orderBranchId = (await fetch(PermissionQuery.BRANCHES_BY_ORDERS, [orderId]))?.branch_id
            const serviceBranchId = (await fetch(PermissionQuery.BRANCHES_BY_SERVICES, [serviceId]))?.branch_id

            if (!orderBranchId) {
                throw new BadRequestError("Bunday buyum mavjud emas!")
            }

            if (!serviceBranchId) {
                throw new BadRequestError("Bunday xizmat mavjud emas!")
            }

            if (
                !allowedBranches.includes(+orderBranchId) ||
                !allowedBranches.includes(+serviceBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeProduct') {
            const productId = variables.productId           // ID!
            const serviceId = variables.serviceId           // ID

            const productBranchId = (await fetch(PermissionQuery.BRANCHES_BY_PRODUCTS, [productId]))?.branch_id
            const serviceBranchId = (await fetch(PermissionQuery.BRANCHES_BY_SERVICES, [serviceId]))?.branch_id

            if (!productBranchId) {
                throw new BadRequestError("Bunday buyum mavjud emas!")
            }

            if (serviceId && !serviceBranchId) {
                throw new BadRequestError("Bunday xizmat mavjud emas!")
            }

            if (
                productId && !allowedBranches.includes(+productBranchId) ||
                serviceId && !allowedBranches.includes(+serviceBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
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
                throw new BadRequestError("Bunday buyum mavjud emas!")
            }
            if (
                !allowedBranches.includes(+productBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'deleteProduct' || query === 'restoreProduct') {
            const productId = variables.productId                  // [ID!]

            const productBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_PRODUCTS, productId)).map(el => +el.branch_id)

            if (
                !productBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
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
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'changeOrder') {
            const orderId = variables.orderId                // ID!
            const regionId = variables.address?.regionId     // ID

            const orderBranchId = (await fetch(PermissionQuery.BRANCHES_BY_ORDERS, [orderId]))?.branch_id
            const regionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_REGIONS, [regionId]))?.branch_id

            if (!orderBranchId) {
                throw new BadRequestError("Bunday buyurtma mavjud emas!")
            }

            if (
                orderId && !allowedBranches.includes(+orderBranchId) ||
                regionId && !allowedBranches.includes(+regionBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
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
                throw new BadRequestError("Bunday buyurtma mavjud emas!")
            }

            if (
                !allowedBranches.includes(+orderBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        else if (query === 'deleteOrder' || query === 'restoreOrder') {
            const orderId = variables.orderId                  // [ID!]

            const orderBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_ORDERS, orderId)).map(el => +el.branch_id)

            if (
                !orderBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // permissions module
        else if (query === 'addPermission' || query === 'deletePermission') {
            const staffId = variables.staffId                  // ID!
            const branchId = variables.branchId                // ID!

            const staffBranchId = (await fetch(PermissionQuery.BRANCHES_BY_STAFFS, [staffId]))?.branch_id

            if (
                !allowedBranches.includes(+staffBranchId) ||
                !allowedBranches.includes(+branchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // notifications and sms
        else if (query === 'sendNotifications' || query === 'sendSMS') {
            const recepientPermissions = {
                'staff': [2301],
                'client': [2300],
                'both': [2300, 2301]
            }
            const user = variables.user                  // UserSelection!
            const userId = variables.userId              // [ID!]
            const branchId = variables.branchId          // [ID!]

            const staffPermissions = await fetchAll(PermissionQuery.PERMISSION_SETS, payload.staffId || 0, [recepientPermissions[user]])
            const allowedBranches = staffPermissions.map(per => +per.branch_id)

            const userBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_USERS, userId)).map(el => +el.branch_id)

            if (
                !branchId.every(branchId => allowedBranches.includes(+branchId)) ||
                !userBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

        // finance module
        else if (query === 'makeOrderTransaction') {
            const orderId = variables.orderId          // ID!

            const orderBranchId = (await fetch(PermissionQuery.BRANCHES_BY_ORDERS, [orderId]))?.branch_id

            if (!orderBranchId) {
                throw new BadRequestError("Bunday buyurtma mavjud emas!")
            }

            if (staffPermissions.find(per => personalPermissions[per.permission_action])) {
                const binding = await fetch(OrderQuery.ORDER_BINDING, orderId, 0, 0, payload.staffId)
                if (!binding) {
                    throw new ForbiddenError("Transaksiyani faqat buyurtma biriktirilgan transport haydovchisi amalga oshira oladi!")
                }
            }

            if (
                orderId && !allowedBranches.includes(+orderBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }
            
        else if (query === 'deleteOrderTransaction' || query === 'changeOrderTransaction') {
            const transactionId = variables.transactionId          // ID!

            const transactionBranchId = (await fetch(PermissionQuery.BRANCHES_BY_ORDER_TRANSACTIONS, [transactionId]))?.branch_id

            if (!transactionBranchId) {
                throw new BadRequestError("Bunday transaksiya mavjud emas!")
            }

            if (staffPermissions.find(per => personalPermissions[per.permission_action])) {
                const transaction = await fetch(OrderTransactionQuery.TRANSACTION, transactionId, payload.staffId, 0, 0)
                if (!transaction) {
                    throw new ForbiddenError("Siz bu transaksiyani amalga oshirmaganligingiz uchun uni o'chirish yoki o'zgartirish mumkin emas!")
                }
            }

            if (
                transactionId && !allowedBranches.includes(+transactionBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }
            
        else if (query === 'makeDebtTransactionIncome') {
            const transactionTo = variables.transactionTo          // ID!

            const transactionToBranchId = (await fetch(PermissionQuery.BRANCHES_BY_STAFFS, [transactionTo]))?.branch_id
            
            if (!transactionToBranchId) {
                throw new BadRequestError("Bunday xodim mavjud emas!")
            }

            if (
                staffPermissions.find(per => personalPermissions[per.permission_action]) &&
                payload.staffId != transactionTo
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan. Siz faqat o'zingizga pul o'tkazishingiz mumkin!")
            }

            if (
                transactionTo && !allowedBranches.includes(+transactionToBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }
            
        else if (query === 'makeDebtTransactionOutcome') {
            const transactionFrom = variables.transactionFrom          // ID!

            const transactionFromBranchId = (await fetch(PermissionQuery.BRANCHES_BY_STAFFS, [transactionFrom]))?.branch_id
            
            if (!transactionFromBranchId) {
                throw new BadRequestError("Bunday xodim mavjud emas!")
            }

            if (
                staffPermissions.find(per => personalPermissions[per.permission_action]) &&
                payload.staffId != transactionFrom
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan. Siz faqat o'zingizdan pul o'tkazishingiz mumkin!")
            }

            if (
                transactionFrom && !allowedBranches.includes(+transactionFromBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }
            
        else if (query === 'changeDebtTransaction') {
            const transactionId = variables.transactionId          // ID!
            const transactionTo = variables.transactionTo         // ID
            const transactionFrom = variables.transactionFrom          // ID

            const transactionBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_DEBT_TRANSACTIONS, [transactionId])).map(el => +el.branch_id)
            const transactionFromBranchId = (await fetch(PermissionQuery.BRANCHES_BY_STAFFS, [transactionFrom]))?.branch_id
            
            if (!transactionBranchIds.length) {
                throw new BadRequestError("Bunday transaksiya mavjud emas!")
            }

            const transaction = await fetch(DebtTransactionQuery.TRANSACTION, transactionId, 0, 0)

            if (
                staffPermissions.find(per => personalPermissions[per.permission_action]) &&
                (
                    (
                        transactionFrom && payload.staffId != transactionFrom ||
                        transactionTo && payload.staffId != transactionTo
                    ) ||
                    (
                        payload.staffId != transaction.transaction_from &&
                        payload.staffId != transaction.transaction_to
                    )
                )
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan. Siz faqat o'zingiz amalga oshirgan transaksiyani o'zgartirishingiz mumkin!")
            }

            if (
                !transactionBranchIds.every(branchId => allowedBranches.includes(+branchId)) ||
                transactionFrom && !allowedBranches.includes(+transactionFromBranchId)
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }
            
        else if (['cancelDebtTransaction', 'acceptDebtTransaction', 'deleteDebtTransaction'].includes(query)) {
            const transactionId = variables.transactionId          // ID!

            const transactionBranchIds = (await fetchAll(PermissionQuery.BRANCHES_BY_DEBT_TRANSACTIONS, [transactionId])).map(el => +el.branch_id)
            
            if (!transactionBranchIds.length) {
                throw new BadRequestError("Bunday transaksiya mavjud emas!")
            }

            const transaction = await fetch(DebtTransactionQuery.TRANSACTION, transactionId, 0, 0)

            if (
                staffPermissions.find(per => personalPermissions[per.permission_action]) &&
                query === 'cancelDebtTransaction' &&
                (
                    payload.staffId != transaction.transaction_from &&
                    payload.staffId != transaction.transaction_to
                )
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan. Siz faqat o'zingiz amalga oshirgan transaksiyani bekor qilishingiz mumkin!")
            }

            if (
                staffPermissions.find(per => personalPermissions[per.permission_action]) &&
                query === 'acceptDebtTransaction' &&
                (
                    payload.staffId != transaction.transaction_to
                )
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan. Siz faqat sizga yuborilgan transaksiyani qabul qilishingiz mumkin!")
            }

            if (
                staffPermissions.find(per => personalPermissions[per.permission_action]) &&
                query === 'deleteDebtTransaction' &&
                (
                    payload.staffId != transaction.transaction_from
                )
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan. Siz faqat o'zingiz amalga transaksiyani o'chirishingiz qilishingiz mumkin!")
            }

            if (
                !transactionBranchIds.every(branchId => allowedBranches.includes(+branchId))
            ) {
                throw new ForbiddenError("Siz uchun ruxsatnoma berilmagan!")
            }
        }

    } else {
        throw new BadRequestError("Use query variables!")
    }  

}
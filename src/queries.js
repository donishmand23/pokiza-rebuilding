export const PUBLIC_QUERIES = [
    'socialSets',
    'areas',
    'branches',
    'neighborhoods',
    'regions',
    'states',
    'streets',
    'loginStaff',
    'enterClientPhone',
    'permissionGroups,',
    'orderStatusInfo',
    'productStatusInfo',
    'monitoringSections',
    'deliveryHours',
    'checkToken',
]

export const PUBLIC_CLIENT_AND_STAFF_QUERIES = [
    'notifications',
    'user'
]

export const PRIVATE_CLIENT_AND_STAFF_QUERIES = [
    'searchGlobal',
    'services',
    'clients',
    'changeClient',
    'restoreClient',
    'deleteClient',
    'orders',
    'addOrder',
    'changeOrder',
    'deleteOrder',
    'restoreOrder',
    'products',
    'deleteNotifications',
]

export const PUBLIC_STAFF_ONLY_QUERIES = [
    'addPermissionGroup',
    'changePermissionGroup',
    'deletePermissionGroup',
    'permissionsList',
    'addSocialSet',
    'changeSocialSet',
    'expanses'
]

export const PRIVATE_STAFF_ONLY_QUERIES = [
    'balances',
    'mainBalances',

    'orderTransactions',
    'makeOrderTransaction',
    'changeOrderTransaction',
    'deleteOrderTransaction',

    'equities',
    'debtTransactions',
    'makeDebtTransactionIncome',
    'makeDebtTransactionOutcome',
    'changeDebtTransaction',
    'cancelDebtTransaction',
    'acceptDebtTransaction',
    'deleteDebtTransaction',

    'moneyTransactions',
    'makeMoneyTransaction',
    'changeMoneyTransaction',
    'acceptMoneyTransaction',
    'cancelMoneyTransaction',
    'deleteMoneyTransaction',

    'addExpanse',
    'deleteExpanse',
    'expanseTransactions',
    'makeExpanseTransaction',
    'changeExpanseTransaction',
    'acceptExpanseTransaction',
    'cancelExpanseTransaction',
    'deleteExpanseTransaction',

    'fondTransactions',
    'makeFondTransaction',
    'changeFondTransaction',
    'acceptFondTransaction',
    'cancelFondTransaction',
    'deleteFondTransaction',

    'staffs',
    'addStaff',
    'changeStaff',
    'deleteStaff',
    'restoreStaff',

    'addClient',

    'sendSMS',
    'sendNotifications',

    'addProduct',
    'changeProduct',
    'changeProductStatus',
    'deleteProduct',
    'restoreProduct',

    'changeOrderStatus',
    'bindOrder',
    'unbindOrder',

    'transports',
    'addTransport',
    'changeTransport',
    'deleteTransport',
    'restoreTransport',
    'registerTransport',
    'unregisterTransport',

    'addService',
    'changeService',
    'enableService',
    'disableService',

    'changeDeliveryHour',
    'monitoring',

    'permissionsUser',
    'addPermission',

    'addBranch',
    'changeBranch',

    'disabledAddresses',
    'disableAddress',
    'enableAddress',
    'addState',
    'addRegion',
    'addNeighborhood',
    'addArea',
    'addStreet',
    'changeState',
    'changeRegion',
    'changeNeighborhood',
    'changeArea',
    'changeStreet',

    'ordersCountStatistics',
    'productServiceCountStatistics',
    'productStatusesCountStatistics',
    'serviceProductsCountStatistics',
    'branchFinanceStatistics',
    'serviceSummaryStatistics',
    'socialSetRegistrationStatistics',
    'productsKPI',
]
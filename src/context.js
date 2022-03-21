import queryParser from '#helpers/queryParser'
import { verify } from '#utils/jwt'
import { mError } from '#helpers/error'


export default function ({ req }) {
	const { operation, fieldName, variables } = queryParser(req.body)
    const Token = req.headers.token
    const reqAgent = req['headers']['user-agent'].trim()

    if(fieldName == '__schema') return

    // public queries
    if( 
        [      
            'socialSets',
            'areas',
            'branches',
            'neighborhoods',
            'regions',
            'states',
            'streets',
            'loginStaff',
            'enterClientPhone',
            'checkToken',

            // later will be moved to client and staff only section
            'searchGlobal',
            'services',
            'orderStatusInfo',
            'productStatusInfo',

            // later will be moved to staffs only section
            'deletedProducts',
            'deletedOrders',
            'staffs',
            'deletedStaffs',
            'addStaff',
            'addClient',
            'deletedClients',
            'addSocialSet',
            'changeSocialSet',
            'disabledAddresses', 
            'disableAddress', 
            'enableAddress',
            'addArea',
            'changeArea',
            'addBranch',
            'changeBranch',
            'addNeighborhood',
            'changeNeighborhood',
            'addRegion',
            'changeRegion',
            'addState',
            'changeState',
            'addStreet',
            'changeStreet',
            'monitoring',
            'monitoringSections',
        ].includes(fieldName)
    ) {
        return { agent: reqAgent }
    }


    // private queries
    if(!Token) {
        throw new Error('token is required!')
    }

    const { registered, userId, staffId, clientId, agent } = verify(Token)

    if(!(agent === reqAgent)) {
        throw new Error('token is sent from wrong device!')
    }

    if(fieldName === 'enterClientPassword') {
        return { agent: reqAgent, userId }
    }

    if(fieldName === 'fillClientData') {
        if(registered) throw new Error('Siz allaqachon ro\'yxatdan o\'tgansiz!')
        return { 
            agent: reqAgent,
            clientId
        }
    }

    // only registred clients and staffs
    if(
        [
            'clients',
            'deleteClient',
            'restoreClient',
            'changeClient',
            'orders',
            'products',
            'addOrder',
            'changeOrder',
            'deleteOrder',
            'restoreOrder',
            'deleteProduct',
            'restoreProduct',
            'changeProduct',
            'notifications',
            'deleteNotifications',
        ].includes(fieldName)
    ) {
        if(!registered) throw new Error('Siz uchun ruxsat yo\'q')
        return { userId, staffId, clientId }
    }

    // only registred staffs
    if(
        [   
            'bindOrder',
            'unbindOrder',
            'changeProductStatus',
            'changeOrderStatus',
            'addProduct',
            'sendNotifications',
            'sendSMS',
            'changeStaff',
            'deleteStaff',
            'restoreStaff',
            'transports',
            'addTransport',
            'deletedTransports',
            'changeTransport',
            'deleteTransport',
            'restoreTransport',
            'disabledServices',
            'deliveryHours',
            'addService',
            'changeService',
            'disableService',
            'enableService',
            'changeDeliveryHour',
        ].includes(fieldName)
    ) {
        if(!registered || !staffId) throw new Error('Siz uchun ruxsat yo\'q')
        return { userId, staffId }
    }
}
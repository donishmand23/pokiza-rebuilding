import queryParser from '#helpers/queryParser'
import { verify } from '#utils/jwt'
import { mError } from '#helpers/error'


export default function ({ req }) {
	const { operation, fieldName, variables } = queryParser(req.body)
    const Token = req.headers.token
    const reqAgent = req['headers']['user-agent'].trim()

    // public queries
    if(fieldName === 'loginStaff') {
        return { agent: reqAgent }
    }

    if(fieldName === 'enterClientPhone') {
        return { agent: reqAgent }
    }

    if( 
        !(['enterClientPassword', 'fillClientData'].includes(fieldName))
    ) return

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
            agent: reqAgent, userId,
            clientId
        }
    }

}


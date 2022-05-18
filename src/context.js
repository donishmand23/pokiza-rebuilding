import {
    PUBLIC_QUERIES,
    PUBLIC_STAFF_ONLY_QUERIES,
    PRIVATE_STAFF_ONLY_QUERIES,
    PUBLIC_CLIENT_AND_STAFF_QUERIES,
    PRIVATE_CLIENT_AND_STAFF_QUERIES
} from './queries.js'
import checkPermission from '#utils/checkPermission'
import queryParser from '#helpers/queryParser'
import { verify } from '#utils/jwt'

export default async function ({ req }) {
    const body = queryParser(req.body)
    const { operation, fieldName, variables } = body

    const Token = req.headers.token
    const reqAgent = req['headers']['user-agent'].trim()

    if(fieldName == '__schema') return

    // public queries
    if(PUBLIC_QUERIES.includes(fieldName)) {
        return { agent: reqAgent }
    }

    // private queries
    if(!Token) {
        throw new Error('token is required!')
    }

    const payload = verify(Token)
    const { registered, userId, staffId, clientId, agent } = payload

    if(!(agent === reqAgent)) {
        throw new Error('token is sent from wrong device!')
    }

    if(fieldName === 'enterClientPassword') {
        return payload
    }

    if(fieldName === 'fillClientData') {
        if(registered) throw new Error('Siz allaqachon ro\'yxatdan o\'tgansiz!')
        return payload
    }

    // registred clients and staffs (public)
    if (PUBLIC_CLIENT_AND_STAFF_QUERIES.includes(fieldName)) {
        if (!registered) throw new Error('Siz uchun ruxsat yo\'q')
        return payload
    }

    // registred clients and staffs (private)
    if (PRIVATE_CLIENT_AND_STAFF_QUERIES.includes(fieldName)) {
        if (!registered) throw new Error('Siz uchun ruxsat yo\'q')
        if (staffId && !clientId) await checkPermission(body, payload)
        return payload
    }

    // registred staffs (public)
    if(PUBLIC_STAFF_ONLY_QUERIES.includes(fieldName)) {
        if(!registered || !staffId) throw new Error('Siz uchun ruxsat yo\'q')
        return payload
    }

    // registred staffs (private)
    if(PRIVATE_STAFF_ONLY_QUERIES.includes(fieldName)) {
        if (!registered || !staffId) throw new Error('Siz uchun ruxsat yo\'q')
        checkPermission(body, payload)
        return payload
    }
}
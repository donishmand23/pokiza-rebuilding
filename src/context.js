import {
    PUBLIC_QUERIES,
    PUBLIC_STAFF_ONLY_QUERIES,
    PRIVATE_STAFF_ONLY_QUERIES,
    PUBLIC_CLIENT_AND_STAFF_QUERIES,
    PRIVATE_CLIENT_AND_STAFF_QUERIES
} from './queries.js'
import { ForbiddenError, BadRequestError } from '#errors'
import checkPermission from '#utils/checkPermission'
import queryParser from '#helpers/queryParser'
import { verify } from '#utils/jwt'

export default async function ({ req }) {
    const body = queryParser(req.body)
    const { fieldName } = body

    const Token = req.headers.token
    const reqAgent = req['headers']['user-agent'].trim()
    console.log('fieldName: ', fieldName)
    if(fieldName == '__schema') return
    if(fieldName == '__typename') return

    // public queries
    if(PUBLIC_QUERIES.includes(fieldName)) {
        return { agent: reqAgent }
    }

    // private queries
    if(!Token) {
        throw new ForbiddenError('Token is required!')
    }

    const payload = verify(Token)
    const { registered, userId, staffId, clientId, agent } = payload

    if(!(agent === reqAgent)) {
        throw new ForbiddenError('token is sent from wrong device!')
    }

    if (fieldName === 'enterClientPassword') {
        console.log(3, payload)
        return payload
    }

    if(fieldName === 'fillClientData') {
        if (registered) throw new BadRequestError('Siz allaqachon ro\'yxatdan o\'tgansiz!')
        return payload
    }

    // registred clients and staffs (public)
    if (PUBLIC_CLIENT_AND_STAFF_QUERIES.includes(fieldName)) {
        if (!registered) throw new ForbiddenError('Siz uchun ruxsatnoma berilmagan!')
        return payload
    }

    // registred clients and staffs (private)
    if (PRIVATE_CLIENT_AND_STAFF_QUERIES.includes(fieldName)) {
        if (!registered) throw new ForbiddenError('Siz uchun ruxsatnoma berilmagan!')
        await checkPermission(body, payload)
        return payload
    }

    // registred staffs (public)
    if(PUBLIC_STAFF_ONLY_QUERIES.includes(fieldName)) {
        if(!registered || !staffId) throw new ForbiddenError('Siz uchun ruxsatnoma berilmagan!')
        return payload
    }

    // registred staffs (private)
    if(PRIVATE_STAFF_ONLY_QUERIES.includes(fieldName)) {
        if (!registered || !staffId) throw new ForbiddenError('Siz uchun ruxsatnoma berilmagan!')
        await checkPermission(body, payload)
        return payload
    }
}
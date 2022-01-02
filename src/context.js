import queryParser from '#helpers/queryParser'
import { verify } from '#utils/jwt'

export default function ({ req }) {
	const { operation, fieldName, variables } = queryParser(req.body)
    const Token = req.headers.token

    // public queries
    if(fieldName === 'loginStaff') {
        return { agent: req['headers']['user-agent'] }
    }

    if(fieldName === 'enterClientPhone') {
        return { agent: req['headers']['user-agent'] }
    }

    // private queries

    if(fieldName === 'enterClientPassword') {
        return { agent: req['headers']['user-agent'] }
    }

}


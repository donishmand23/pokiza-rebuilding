import queryParser from '#helpers/queryParser'

export default function ({ req }) {
	const { operation, fieldName, variables } = queryParser(req.body)

    if(fieldName === 'loginStaff') {
        return { agent: req['headers']['user-agent'] }
    }

}


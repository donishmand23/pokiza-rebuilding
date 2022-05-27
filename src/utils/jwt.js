import { InternalServerError, AuthorizationError } from '#errors'
import crypto from 'crypto'
import { JWT } from '../config.js'

const defaultAlgorithm = 'aes256'
const defaultSecretKey = JWT.secretKey
const expiresIn = JWT.expiresIn

const sign = (payload, deadLine) => {
	try {
		const currentTime = Date.now() / 1000 | 0
		payload.iat = currentTime
		payload.exp = currentTime + (deadLine || expiresIn)

		const data = JSON.stringify(payload)

		const iv = crypto.randomBytes(16)
    	const cipher = crypto.createCipheriv(defaultAlgorithm, defaultSecretKey, iv)
    	const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
    	const token = iv.toString('hex') + ':' + encrypted.toString('hex')

    	return token
	} catch(error) {
		throw new InternalServerError(error.message || error.detail || error)
	}
}

const verify = (token) => {
	try {
		const [ iv, content ] = token.split(':')

    	const decipher = crypto.createDecipheriv(defaultAlgorithm, defaultSecretKey, Buffer.from(iv, 'hex'))
    	const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()])
    	const payload = JSON.parse(decrpyted)

    	const currentTime = Date.now() / 1000 | 0
    	if(payload.exp < currentTime) {
    		throw new AuthorizationError("Token has expired!")
    	}

    	return payload
	} catch(error) {
		if(error.message.includes('Token')) {
			throw error
		}
		throw new AuthorizationError("Invaild Token!")
	}
}


export {
	verify,
	sign,
}

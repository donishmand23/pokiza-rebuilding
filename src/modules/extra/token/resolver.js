import { JWT } from '../../../config.js'
import crypto from 'crypto'

const defaultAlgorithm = 'aes256'
const defaultSecretKey = JWT.secretKey
const expiresIn = JWT.expiresIn

export default {
	Query: {
		checkToken: async (_, { token }) => {
			try {
				const [ iv, content ] = token.split(':')
				
    			const decipher = crypto.createDecipheriv(defaultAlgorithm, defaultSecretKey, Buffer.from(iv, 'hex'))
    			const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()])
    			const payload = JSON.parse(decrpyted)
				
    			const currentTime = Date.now() / 1000 | 0

    			if(payload.exp < currentTime) {
    				return {
    					expired: true,
    					remainingTime: 0
    				}
    			} else {
    				return {
    					expired: false,
    					remainingTime: payload.exp - currentTime
    				}
    			}
				
			} catch(error) {
				console.log(error)
				throw 'Invalid Token!'
			}
		}
	},

}
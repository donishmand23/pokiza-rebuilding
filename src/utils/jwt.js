import { sign, verify } from 'jsonwebtoken'
import { JWT } from '../config.js'

export  default {
	sign: payload => sign(payload, JWT.secretKey),
	verify: token => verify(token, JWT.secretKey)
}

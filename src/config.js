import dotenv from 'dotenv'
import path from 'path'
 
dotenv.config({ path: path.join(process.cwd(), '.env') })	

const PORT = process.env.NODE_ENV === 'production' ? 443 : 4000

const PG = {
	host: 'localhost',
	user: 'postgres',
	password: '2303',
	port: 5432,
	database: 'pokiza'
}

const JWT = {
	secretKey: '1OVH6tdmpNTjRRIqCc7rdxs01PwHzfr3',
	expiresIn: 60 * 60 * 24 * 24 * 24
}

export {
	PORT,
	PG,
	JWT
}
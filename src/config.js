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

// const PG = {
//	 connectionString: 'postgres://olycltna:uMLD4jl-lcoo_Gio2DLW3LbchXUUB62n@kesavan.db.elephantsql.com/olycltna'
// }


const JWT = {
	secretKey: '1OVH6tdmpNTjRRIqCc7rdxs01PwHzfr3',
	expiresIn: 60 * 60 * 24 * 24 * 24
}

export {
	PORT,
	PG,
	JWT
}
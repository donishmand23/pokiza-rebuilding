// import dotenv from 'dotenv'
// dotenv.config()	

const PORT = process.env.PORT || 443


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
// import dotenv from 'dotenv'
// dotenv.config()	

const PORT = process.env.PORT || 4000


// const PG = {
// 	host: 'localhost',
// 	user: 'postgres',
// 	password: '2303',
// 	port: 5432,
// 	database: 'pokiza'
// }

const PG = {
	connectionString: 'postgres://vxphabyi:EC4FczOUUW-HJpFqwY3X7DRu2bTAbN7d@john.db.elephantsql.com/vxphabyi'
}


const JWT = {
	secretKey: '1OVH6tdmpNTjRRIqCc7rdxs01PwHzfr3',
	expiresIn: 60 * 60 * 24
}

export {
	PORT,
	PG,
	JWT
}


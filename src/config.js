// import dotenv from 'dotenv'
// dotenv.config()	

const PORT = process.env.PORT || 4000

<<<<<<< HEAD
// const PG = {
// 	host: 'localhost',
// 	user: 'postgres',
// 	password: '2303',
// 	port: 5432,
// 	database: 'pokiza'
// }

const PG = {
	connectionString: 'postgres://uqziszup:bhCvhNxK8d0yAWO4mOpUcThtOTvnfh1E@kashin.db.elephantsql.com/uqziszup'
=======
//const PG = {
//	host: 'localhost',
//	user: 'postgres',
//	password: '2303',
//	port: 5432,
//	database: 'pokiza'
//}

const PG = {
        connectionString: 'postgres://uqziszup:bhCvhNxK8d0yAWO4mOpUcThtOTvnfh1E@kashin.db.elephantsql.com/uqziszup'
>>>>>>> 85c667636feb59dda67951931b94d0a8ac547171
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


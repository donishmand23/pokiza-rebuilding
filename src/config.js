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
	connectionString: 'postgres://uqziszup:bhCvhNxK8d0yAWO4mOpUcThtOTvnfh1E@kashin.db.elephantsql.com/uqziszup'
}

const JWT = {
	secretKey: "SECRET_WORD",
	expiresIn: 7200
}

export {
	PORT,
	PG,
	JWT
}


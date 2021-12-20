// import dotenv from 'dotenv'
// dotenv.config()	

const PAGINATION = {
	page: 1,
	limit: 1000
}

const PORT = process.env.PORT || 4000

// const PG = {
// 	host: 'kashin.db.elephantsql.com',
// 	user: 'uqziszup',
// 	password: 'bhCvhNxK8d0yAWO4mOpUcThtOTvnfh1E',
// 	port: 5432,
// 	database: 'uqziszup'
// }

const PG = {
	connectionString: 'postgres://uqziszup:bhCvhNxK8d0yAWO4mOpUcThtOTvnfh1E@kashin.db.elephantsql.com/uqziszup'
}

const JWT = {
	secretKey: "SECRET_WORD",
	expiresIn: 7200
}

export {
	PAGINATION,
	PORT,
	PG,
	JWT
}


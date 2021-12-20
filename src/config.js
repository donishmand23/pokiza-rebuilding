// import dotenv from 'dotenv'
// dotenv.config()	

const PAGINATION = {
	page: 1,
	limit: 1000
}

const PORT = process.env.PORT || 4000

const PG = {
	host: 'localhost',
	user: 'postgres',
	password: '2303',
	port: 5432,
	database: 'pokiza'
}

// const PG = {
// 	connectionString: 'postgres://dttuatwi:oxuKexMAm0mN6iu0LM9WROKtvgb32YiQ@kashin.db.elephantsql.com/dttuatwi'
// }

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


const USERS = `
	SELECT 
		u.user_id,
		u.user_main_contact,
		u.user_second_contact,
		u.user_first_name,
		u.user_last_name,
		u.user_gender,
		u.branch_id,
		u.address_id,
		EXTRACT(YEAR FROM AGE(CURRENT_DATE, u.user_birth_date)) user_age,
		to_char(u.user_birth_date, 'YYYY-MM-DD') user_birth_date,
		to_char(u.user_created_at, 'YYYY-MM-DD HH24:MI:SS') user_created_at
	FROM users u
	WHERE
	CASE
		WHEN $1 > 0 THEN u.user_id = $1
		ELSE TRUE
	END
`

const CHECK_USER_CONTACT = `
	SELECT user_id
	FROM users WHERE user_main_contact = $1
`


export default {
	CHECK_USER_CONTACT,
	USERS
}
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

const USER = `
	SELECT
		CASE
			WHEN u.user_id IS NOT NULL THEN (
				JSON_BUILD_OBJECT(
					'user_id', u.user_id,
					'user_main_contact', u.user_main_contact,
					'user_second_contact', u.user_second_contact,
					'user_first_name', u.user_first_name,
					'user_last_name', u.user_last_name,
					'user_gender', u.user_gender,
					'branch_id', u.branch_id,
					'address_id', u.address_id,
					'user_age', EXTRACT(YEAR FROM AGE(CURRENT_DATE, u.user_birth_date)),
					'user_birth_date', to_char(u.user_birth_date, 'YYYY-MM-DD'),
					'user_created_at', to_char(u.user_created_at, 'YYYY-MM-DD HH24:MI:SS')
				)
			) ELSE NULL
		END AS user,
		CASE
			WHEN s.staff_id IS NOT NULL THEN (
				JSON_BUILD_OBJECT(
					'staff_id', s.staff_id,
					'user_id', s.user_id,
					'staff_img', s.staff_img,
					'staff_summary', s.staff_summary,
					'user_gender', u.user_gender,
					'staff_created_at', to_char(s.staff_created_at, 'YYYY-MM-DD HH24:MI:SS'),
					'full_count', count(*) OVER()
				)
			) ELSE NULL
		END AS staff,
		CASE
			WHEN c.client_id IS NOT NULL THEN (
				JSON_BUILD_OBJECT(
					'client_id', c.client_id,
					'client_status', c.client_status,
					'client_summary', c.client_summary,
					'social_set_id', c.social_set_id,
					'user_id', c.user_id,
					'full_count', count(*) OVER(),
					'client_created_at', to_char(c.client_created_at, 'YYYY-MM-DD HH24:MI:SS')
				)
			) ELSE NULL
		END AS client
	FROM users u
	LEFT JOIN staffs s ON u.user_id = s.user_id
	LEFT JOIN clients c ON u.user_id = c.user_id
	WHERE
	CASE 
		WHEN $1 = FALSE THEN s.staff_deleted_at IS NULL
		WHEN $1 = TRUE THEN s.staff_deleted_at IS NOT NULL
	END AND
	CASE
		WHEN $2 > 0 THEN u.user_id = $2
		ELSE TRUE
	END AND
	CASE
		WHEN $3 > 0 THEN s.staff_id = $3
		ELSE TRUE
	END AND
	CASE
		WHEN $4 > 0 THEN c.client_id = $4
		ELSE TRUE
	END
`

const USER_CONTACTS = `
	SELECT
		u.user_main_contact as con
	FROM users u
	LEFT JOIN staffs s ON u.user_id = s.user_id
	LEFT JOIN clients c ON u.user_id = c.user_id
	WHERE u.user_deleted_contact IS NULL AND
	CASE
		WHEN $1 = 'staff' THEN s.staff_id IS NOT NULL
		WHEN $1 = 'client' THEN c.client_id IS NOT NULL
		ELSE TRUE
	END AND
	CASE
		WHEN $1 = 'staff' THEN s.staff_id <> $4
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($2::INT[], 1) > 0 THEN u.branch_id = ANY($2::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($3::INT[], 1) > 0 THEN u.user_id = ANY($3::INT[])
		ELSE TRUE
	END
`

const CHECK_USER_CONTACT = `
	SELECT 
		user_id
	FROM users 
	WHERE user_deleted_contact IS NULL AND
	user_main_contact = $1
`

const ADD_USER = `
	INSERT INTO users (
		user_main_contact,
		user_password
	) VALUES ($1, crypt($2, gen_salt('bf')))
	RETURNING user_id, FALSE as is_registered
`


export default {
	CHECK_USER_CONTACT,
	USER_CONTACTS,
	ADD_USER,
	USERS,
	USER,
}
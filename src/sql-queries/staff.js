const STAFFS = `
	SELECT 
		s.staff_id,
		s.user_id,
		s.staff_img,
		s.staff_summary,
		u.user_gender,
		to_char(s.staff_created_at, 'YYYY-MM-DD HH24:MI:SS') staff_created_at,
		count(*) OVER() as full_count
	FROM staffs s
	NATURAL JOIN users u
	LEFT JOIN addresses a ON a.address_id = u.address_id
	LEFT JOIN states sta ON sta.state_id = a.state_id
	LEFT JOIN regions r ON r.region_id = a.region_id
	LEFT JOIN neighborhoods n ON n.neighborhood_id = a.neighborhood_id
	LEFT JOIN streets st ON st.street_id = a.street_id
	LEFT JOIN areas ar ON ar.area_id = a.area_id
	WHERE
	CASE 
		WHEN $3 = FALSE THEN s.staff_deleted_at IS NULL
		WHEN $3 = TRUE THEN s.staff_deleted_at IS NOT NULL
	END AND
	CASE
		WHEN $4 > 0 THEN s.staff_id = $4
		ELSE TRUE
	END AND
	CASE
		WHEN $5::INT[] <> ARRAY[0, 0] THEN (
			EXTRACT(
				YEAR FROM AGE(CURRENT_DATE, u.user_birth_date)
			)::INT BETWEEN ($5::INT[])[1] AND ($5::INT[])[2]
		)
		ELSE TRUE
	END AND
	CASE
		WHEN $6 = ANY(ARRAY[1, 2]) THEN u.user_gender = $6
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($7::INT[], 1) > 0 THEN u.branch_id = ANY($7::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($8::INT[], 1) > 0 THEN sta.state_id = ANY($8::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($9::INT[], 1) > 0 THEN r.region_id = ANY($9::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($10::INT[], 1) > 0 THEN n.neighborhood_id = ANY($10::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($11::INT[], 1) > 0 THEN st.street_id = ANY($11::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($12::INT[], 1) > 0 THEN ar.area_id = ANY($12::INT[]) 
		ELSE TRUE
	END
	ORDER BY 
	(CASE WHEN $13 = 1 AND $14 = 1 THEN u.user_first_name END) DESC,
	(CASE WHEN $13 = 2 AND $14 = 1 THEN u.user_last_name END) DESC,
	(CASE WHEN $13 = 3 AND $14 = 1 THEN u.user_birth_date END) ASC,
	(CASE WHEN $13 = 4 AND $14 = 1 THEN s.staff_id END) DESC,
	(CASE WHEN $13 = 5 AND $14 = 1 THEN s.staff_created_at END) DESC,
	(CASE WHEN $13 = 1 AND $14 = 2 THEN u.user_first_name END) ASC,
	(CASE WHEN $13 = 2 AND $14 = 2 THEN u.user_last_name END) ASC,
	(CASE WHEN $13 = 3 AND $14 = 2 THEN u.user_birth_date END) DESC,
	(CASE WHEN $13 = 4 AND $14 = 2 THEN s.staff_id END) ASC,
	(CASE WHEN $13 = 5 AND $14 = 2 THEN s.staff_created_at END) ASC
	OFFSET $1 ROWS FETCH FIRST $2 ROW ONLY
`

const SEARCH_STAFFS = `
	SELECT 
		s.staff_id,
		s.user_id,
		s.staff_img,
		s.staff_summary,
		u.user_gender,
		to_char(s.staff_created_at, 'YYYY-MM-DD HH24:MI:SS') staff_created_at,
		count(*) OVER() as full_count
	FROM staffs s
	NATURAL JOIN users u
	WHERE s.staff_deleted_at IS NULL AND
	CASE
		WHEN ARRAY_LENGTH($3::INT[], 1) > 0 THEN u.branch_id = ANY($3::INT[])
		ELSE TRUE
	END AND
	(	
		s.staff_id = $1::INT OR
		s.staff_summary ILIKE CONCAT('%', $2::VARCHAR, '%') OR
		u.user_first_name ILIKE CONCAT('%', $2::VARCHAR, '%') OR
		u.user_last_name ILIKE CONCAT('%', $2::VARCHAR, '%') OR
	 	u.user_main_contact ILIKE CONCAT('%', $2::VARCHAR, '%') OR
	 	u.user_second_contact ILIKE CONCAT('%', $2::VARCHAR, '%') OR
	 	CAST(u.user_birth_date AS VARCHAR) ILIKE CONCAT('%', $2::VARCHAR, '%')
	)
`

const ADD_STAFF = `
	WITH 
	address AS (
		INSERT INTO addresses (
			state_id, region_id, neighborhood_id, street_id, 
			area_id, address_home_number, address_target
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING address_id
	),
	new_user AS (
		INSERT INTO users (
			user_main_contact, user_password, user_second_contact, user_first_name, 
			user_last_name, user_birth_date, user_gender, 
			branch_id, address_id
		) SELECT $8, crypt($9, gen_salt('bf')), $10, $11, $12, $13, $14, $15, a.address_id
		FROM address a
		RETURNING user_id
	)
	INSERT INTO staffs (
		staff_img, staff_summary, user_id
	) SELECT 
		$16, $17, u.user_id FROM new_user u
	RETURNING *,
	to_char(staff_created_at, 'YYYY-MM-DD HH24:MI:SS') staff_created_at
`

const CHANGE_STAFF = `
	WITH 
	address AS (
		UPDATE addresses a SET
			state_id = (
				CASE 
					WHEN $2 = FALSE THEN a.state_id
					WHEN $2 = TRUE AND $3 > 0 THEN $3
					ELSE NULL
				END
			), 
			region_id = (
				CASE 
					WHEN $2 = FALSE THEN a.region_id
					WHEN $2 = TRUE AND $4 > 0 THEN $4
					ELSE NULL
				END
			), 
			neighborhood_id = (
				CASE 
					WHEN $2 = FALSE THEN a.neighborhood_id
					WHEN $2 = TRUE AND $5 > 0 THEN $5
					ELSE NULL
				END
			), 
			street_id = (
				CASE 
					WHEN $2 = FALSE THEN a.street_id
					WHEN $2 = TRUE AND $6 > 0 THEN $6
					ELSE NULL
				END
			), 
			area_id = (
				CASE 
					WHEN $2 = FALSE THEN a.area_id
					WHEN $2 = TRUE AND $7 > 0 THEN $7
					ELSE NULL
				END
			), 
			address_home_number = (
				CASE 
					WHEN $2 = FALSE THEN a.address_home_number
					WHEN $2 = TRUE AND $8 > 0 THEN $8
					ELSE NULL
				END
			), 
			address_target = (
				CASE 
					WHEN $2 = FALSE THEN a.address_target
					WHEN $2 = TRUE AND LENGTH($9) > 0 THEN $9
					ELSE NULL
				END
			)
		FROM users u
		NATURAL JOIN staffs s
		WHERE s.staff_deleted_at IS NULL AND
		u.address_id = a.address_id AND s.staff_id = $1
		RETURNING a.address_id
	),
	updated_user AS (
		UPDATE users u SET
			user_main_contact = (
				CASE 
					WHEN LENGTH($10) > 0 THEN $10 ELSE u.user_main_contact 
				END
			), 
			user_password = (
				CASE 
					WHEN LENGTH($11) > 0 THEN crypt($11, gen_salt('bf')) ELSE u.user_password 
				END
			), 
			user_second_contact = (
				CASE 
					WHEN LENGTH($12) > 0 THEN $12 ELSE u.user_second_contact 
				END
			), 
			user_first_name = (
				CASE 
					WHEN LENGTH($13) > 0 THEN $13 ELSE u.user_first_name 
				END
			), 
			user_last_name = (
				CASE 
					WHEN LENGTH($14) > 0 THEN $14 ELSE u.user_last_name 
				END
			), 
			user_birth_date = (
				CASE 
					WHEN LENGTH($15) > 0 THEN TO_DATE($15, 'YYYY-MM-DD') ELSE u.user_birth_date 
				END
			), 
			user_gender = (
				CASE 
					WHEN $16 > 0 THEN $16 ELSE u.user_gender 
				END
			), 
			branch_id = (
				CASE 
					WHEN $17 > 0 THEN $17 ELSE u.branch_id 
				END
			)
		FROM address a
		NATURAL JOIN staffs s
		WHERE u.user_deleted_contact IS NULL AND
		s.staff_id = $1 AND a.address_id = u.address_id
		RETURNING u.user_gender
	) 
	UPDATE staffs s SET
		staff_img = (
			CASE 
				WHEN LENGTH($18) > 0 THEN $18 ELSE s.staff_img 
			END
		), 
		staff_summary = (
			CASE 
				WHEN LENGTH($19) > 0 THEN $19 ELSE s.staff_summary 
			END
		)
	FROM updated_user u
	WHERE s.staff_deleted_at IS NULL AND s.staff_id = $1
	RETURNING s.*,
	u.user_gender,
	to_char(s.staff_created_at, 'YYYY-MM-DD HH24:MI:SS') staff_created_at
`

const STAFF_PHOTO = `
	SELECT staff_img
	FROM staffs WHERE staff_id = $1
`

const DELETE_STAFF = `
	WITH deleted_user AS (
		UPDATE users u SET
			user_deleted_contact = u.user_main_contact,
			user_main_contact = NULL
		FROM staffs s
		WHERE u.user_id = s.user_id AND u.user_deleted_contact IS NULL AND
		s.staff_id = $1
		RETURNING u.user_id, u.user_gender
	) UPDATE staffs s SET
		staff_deleted_at = current_timestamp
	FROM deleted_user du
	WHERE s.staff_deleted_at IS NULL AND
	du.user_id = s.user_id AND s.staff_id = $1
	RETURNING s.*,
	du.user_gender,
	to_char(s.staff_created_at, 'YYYY-MM-DD HH24:MI:SS') staff_created_at
`

const RESTORE_STAFF = `
	WITH restored_user AS (
		UPDATE users u SET
			user_deleted_contact = NULL,
			user_main_contact = u.user_deleted_contact
		FROM staffs s
		WHERE u.user_id = s.user_id AND u.user_deleted_contact IS NOT NULL AND
		s.staff_id = $1
		RETURNING u.user_id, u.user_gender
	) UPDATE staffs s SET
		staff_deleted_at = NULL
	FROM restored_user ru
	WHERE s.staff_deleted_at IS NOT NULL AND 
	ru.user_id = s.user_id AND s.staff_id = $1
	RETURNING s.*,
	ru.user_gender,
	to_char(s.staff_created_at, 'YYYY-MM-DD HH24:MI:SS') staff_created_at
`

const LOGIN_STAFF = `
	SELECT
		s.staff_id,
		s.user_id,
		s.staff_img,
		s.staff_summary,
		u.user_gender,
		to_char(s.staff_created_at, 'YYYY-MM-DD HH24:MI:SS') staff_created_at,
		count(*) OVER() as full_count
	FROM users u
	RIGHT JOIN staffs s ON s.user_id = u.user_id
	WHERE s.staff_deleted_at IS NULL AND
	u.user_main_contact = $1 AND
	u.user_password = crypt($2, user_password)
`

export default {
	SEARCH_STAFFS,
	RESTORE_STAFF,
	DELETE_STAFF,
	CHANGE_STAFF,
	LOGIN_STAFF,
	STAFF_PHOTO,
	ADD_STAFF,
	STAFFS
}
const CLIENTS = `
	SELECT 
		c.client_id,
		c.client_status,
		c.client_summary,
		c.social_set_id,
		c.user_id,
		count(*) OVER() as full_count,
		to_char(c.client_created_at, 'YYYY-MM-DD HH24:MI:SS') client_created_at
	FROM clients c
	NATURAL JOIN users u
	LEFT JOIN addresses a ON a.address_id = u.address_id
	LEFT JOIN states s ON s.state_id = a.state_id
	LEFT JOIN regions r ON r.region_id = a.region_id
	LEFT JOIN neighborhoods n ON n.neighborhood_id = a.neighborhood_id
	LEFT JOIN streets st ON st.street_id = a.street_id
	LEFT JOIN areas ar ON ar.area_id = a.area_id
	WHERE
	CASE 
		WHEN $3 = FALSE THEN c.client_deleted_at IS NULL
		WHEN $3 = TRUE THEN c.client_deleted_at IS NOT NULL
	END AND
	CASE
		WHEN $4 > 0 THEN c.client_id = $4
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($5::INT[], 1) > 0 THEN c.client_status = ANY($5::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($6::INT[], 1) > 0 THEN c.social_set_id = ANY($6::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN $7::INT[] <> ARRAY[0, 0] THEN (
			EXTRACT(
				YEAR FROM AGE(CURRENT_DATE, u.user_birth_date)
			)::INT BETWEEN ($7::INT[])[1] AND ($7::INT[])[2]
		)
		ELSE TRUE
	END AND
	CASE
		WHEN $8 = ANY(ARRAY[1, 2]) THEN u.user_gender = $8
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($9::INT[], 1) > 0 THEN u.branch_id = ANY($9::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($10::INT[], 1) > 0 THEN s.state_id = ANY($10::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($11::INT[], 1) > 0 THEN r.region_id = ANY($11::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($12::INT[], 1) > 0 THEN n.neighborhood_id = ANY($12::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($13::INT[], 1) > 0 THEN st.street_id = ANY($13::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($14::INT[], 1) > 0 THEN ar.area_id = ANY($14::INT[]) 
		ELSE TRUE
	END
	ORDER BY 
	(CASE WHEN $15 = 1 AND $16 = 1 THEN u.user_first_name END) DESC,
	(CASE WHEN $15 = 2 AND $16 = 1 THEN u.user_last_name END) DESC,
	(CASE WHEN $15 = 3 AND $16 = 1 THEN u.user_birth_date END) ASC,
	(CASE WHEN $15 = 4 AND $16 = 1 THEN c.client_id END) DESC,
	(CASE WHEN $15 = 5 AND $16 = 1 THEN c.client_created_at END) DESC,
	(CASE WHEN $15 = 1 AND $16 = 2 THEN u.user_first_name END) ASC,
	(CASE WHEN $15 = 2 AND $16 = 2 THEN u.user_last_name END) ASC,
	(CASE WHEN $15 = 3 AND $16 = 2 THEN u.user_birth_date END) DESC,
	(CASE WHEN $15 = 4 AND $16 = 2 THEN c.client_id END) ASC,
	(CASE WHEN $15 = 5 AND $16 = 2 THEN c.client_created_at END) ASC
	OFFSET $1 ROWS FETCH FIRST $2 ROW ONLY
`

const SEARCH_CLIENTS = `
	SELECT 
		c.client_id,
		c.client_status,
		c.client_summary,
		c.social_set_id,
		c.user_id,
		count(*) OVER() as full_count,
		to_char(c.client_created_at, 'YYYY-MM-DD HH24:MI:SS') client_created_at
	FROM clients c
	NATURAL JOIN users u
	WHERE c.client_deleted_at IS NULL AND
	CASE
		WHEN ARRAY_LENGTH($3::INT[], 1) > 0 THEN u.branch_id = ANY($3::INT[])
		ELSE TRUE
	END AND
	(	
		c.client_id = $1::INT OR
		c.client_summary ILIKE CONCAT('%', $2::VARCHAR, '%') OR
		u.user_first_name ILIKE CONCAT('%', $2::VARCHAR, '%') OR
		u.user_last_name ILIKE CONCAT('%', $2::VARCHAR, '%') OR
	 	u.user_main_contact ILIKE CONCAT('%', $2::VARCHAR, '%') OR
	 	u.user_second_contact ILIKE CONCAT('%', $2::VARCHAR, '%') OR
	 	CAST(u.user_birth_date AS VARCHAR) ILIKE CONCAT('%', $2::VARCHAR, '%')
	)
`

const ADD_CLIENT = `
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
			user_main_contact, user_second_contact, user_first_name, 
			user_last_name, user_birth_date, user_gender, 
			branch_id, address_id
		) SELECT $8, $9, $10, $11, $12, $13, r.branch_id, a.address_id
		FROM address a
		LEFT JOIN regions r ON r.region_id = $2
		RETURNING user_id
	)
	INSERT INTO clients (
		client_status, social_set_id, client_summary, user_id
	) SELECT 
		(CASE WHEN $14 > 0 THEN $14 ELSE 1 END), 
		$15, $16, u.user_id FROM new_user u
	RETURNING *,
	to_char(client_created_at, 'YYYY-MM-DD HH24:MI:SS') client_created_at
`

const CHANGE_CLIENT = `
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
		NATURAL JOIN clients c
		WHERE c.client_deleted_at IS NULL AND 
		u.address_id = a.address_id AND c.client_id = $1
		RETURNING a.address_id
	),
	updated_user AS (
		UPDATE users u SET
			user_main_contact = (
				CASE 
					WHEN LENGTH($10) > 0 THEN $10 ELSE u.user_main_contact 
				END
			), 
			user_second_contact = (
				CASE 
					WHEN LENGTH($11) > 0 THEN $11 ELSE u.user_second_contact 
				END
			), 
			user_first_name = (
				CASE 
					WHEN LENGTH($12) > 0 THEN $12 ELSE u.user_first_name 
				END
			), 
			user_last_name = (
				CASE 
					WHEN LENGTH($13) > 0 THEN $13 ELSE u.user_last_name 
				END
			), 
			user_birth_date = (
				CASE 
					WHEN LENGTH($14) > 0 THEN TO_DATE($14, 'YYYY-MM-DD') ELSE u.user_birth_date 
				END
			), 
			user_gender = (
				CASE 
					WHEN $15 > 0 THEN $15 ELSE u.user_gender 
				END
			), 
			branch_id = (
				CASE 
					WHEN r.branch_id IS NOT NULL THEN r.branch_id ELSE u.branch_id 
				END
			)
		FROM address a
		NATURAL JOIN clients c
		LEFT JOIN regions r ON r.region_id = $4
		WHERE u.user_deleted_contact IS NULL AND 
		c.client_id = $1 AND a.address_id = u.address_id
	) 
	UPDATE clients c SET
		client_status = (
			CASE 
				WHEN $16 > 0 THEN $16 ELSE c.client_status 
			END
		), 
		client_summary = (
			CASE 
				WHEN LENGTH($17) > 0 THEN $17 ELSE c.client_summary 
			END
		)
	WHERE c.client_deleted_at IS NULL AND
	c.client_id = $1
	RETURNING *,
	to_char(client_created_at, 'YYYY-MM-DD HH24:MI:SS') client_created_at
`

const DELETE_CLIENT = `
	WITH deleted_user AS (
		UPDATE users u SET
			user_deleted_contact = u.user_main_contact,
			user_main_contact = NULL
		FROM clients c
		WHERE u.user_id = c.user_id AND u.user_deleted_contact IS NULL AND
		c.client_id = $1
		RETURNING u.user_id, u.user_gender
	) UPDATE clients c SET
		client_deleted_at = current_timestamp
	FROM deleted_user du
	WHERE c.client_deleted_at IS NULL AND
	du.user_id = c.user_id AND c.client_id = $1
	RETURNING c.*,
	ROW_TO_JSON(du.*) as user,
	du.user_gender,
	to_char(c.client_created_at, 'YYYY-MM-DD HH24:MI:SS') client_created_at
`

const RESTORE_CLIENT = `
	WITH restored_user AS (
		UPDATE users u SET
			user_deleted_contact = NULL,
			user_main_contact = u.user_deleted_contact
		FROM clients c
		WHERE u.user_id = c.user_id AND u.user_deleted_contact IS NOT NULL AND
		c.client_id = $1
		RETURNING u.user_id, u.user_gender
	) UPDATE clients c SET
		client_deleted_at = NULL
	FROM restored_user ru
	WHERE c.client_deleted_at IS NOT NULL AND 
	ru.user_id = c.user_id AND c.client_id = $1
	RETURNING c.*,
	ru.user_gender,
	to_char(c.client_created_at, 'YYYY-MM-DD HH24:MI:SS') client_created_at
`


export default {
	SEARCH_CLIENTS,
	RESTORE_CLIENT,
	DELETE_CLIENT,
	CHANGE_CLIENT,
	ADD_CLIENT,
	CLIENTS,
}
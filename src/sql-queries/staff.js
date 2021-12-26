const STAFFS = `
	SELECT 
		s.staff_id,
		s.user_id,
		s.staff_img,
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
	WHERE s.staff_deleted_at IS NULL AND
	CASE
		WHEN $3 > 0 THEN s.staff_id = $3
		ELSE TRUE
	END AND
	CASE
		WHEN $4::INT[] <> ARRAY[0, 0] THEN (
			EXTRACT(
				YEAR FROM AGE(CURRENT_DATE, u.user_birth_date)
			)::INT BETWEEN ($4::INT[])[1] AND ($4::INT[])[2]
		)
		ELSE TRUE
	END AND
	CASE
		WHEN $5 = ANY(ARRAY[1, 2]) THEN u.user_gender = $5
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($6::INT[], 1) > 0 THEN u.branch_id = ANY($6::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($7) > 0 THEN (
			u.user_first_name ILIKE CONCAT('%', $7, '%') OR
			u.user_last_name ILIKE CONCAT('%', $7, '%') OR
			u.user_main_contact ILIKE CONCAT('%', $7, '%') OR
			u.user_second_contact ILIKE CONCAT('%', $7, '%') OR
			CAST(u.user_birth_date AS VARCHAR) ILIKE CONCAT('%', $7, '%')
		) ELSE TRUE
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
	(CASE WHEN $13 = 4 AND $14 = 1 THEN u.user_created_at END) ASC,
	(CASE WHEN $13 = 5 AND $14 = 1 THEN s.staff_id END) DESC,
	(CASE WHEN $13 = 6 AND $14 = 1 THEN s.staff_created_at END) DESC,
	(CASE WHEN $13 = 1 AND $14 = 2 THEN u.user_first_name END) ASC,
	(CASE WHEN $13 = 2 AND $14 = 2 THEN u.user_last_name END) ASC,
	(CASE WHEN $13 = 3 AND $14 = 2 THEN u.user_birth_date END) DESC,
	(CASE WHEN $13 = 4 AND $14 = 2 THEN u.user_created_at END) DESC,
	(CASE WHEN $13 = 5 AND $14 = 2 THEN s.staff_id END) ASC,
	(CASE WHEN $13 = 6 AND $14 = 2 THEN s.staff_created_at END) ASC
	OFFSET $1 ROWS FETCH FIRST $2 ROW ONLY
`


export default {
	STAFFS
}
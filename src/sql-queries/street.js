const STREETS = `
	SELECT 
		s.street_id,
		s.street_name,
		s.street_distance,
		to_char(s.street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
	FROM streets s
	INNER JOIN neighborhood_streets ns ON s.street_id = ns.street_id
	INNER JOIN neighborhoods n ON n.neighborhood_id = ns.neighborhood_id AND n.neighborhood_deleted_at IS NULL
	INNER JOIN regions r ON r.region_id = n.region_id AND r.region_deleted_at IS NULL
	INNER JOIN states st ON r.state_id = st.state_id AND st.state_deleted_at IS NULL
	WHERE s.street_deleted_at IS NULL AND
	CASE 
		WHEN $1 > 0 THEN r.region_id = $1
		ELSE TRUE
	END AND
	CASE 
		WHEN $2 > 0 THEN ns.neighborhood_id = $2
		ELSE TRUE
	END AND
	CASE 
		WHEN $3 > 0 THEN s.street_id = $3
		ELSE TRUE
	END
`

const STREETS_FOR_AREAS = `
	SELECT 
		s.street_id,
		s.street_name,
		s.street_distance,
		to_char(s.street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
	FROM streets s
	INNER JOIN street_areas sa ON sa.street_id = s.street_id
	INNER JOIN areas a ON a.area_id = sa.area_id
	WHERE s.street_deleted_at IS NULL AND a.area_id = $1
`

const STREETS_FOR_NEIGHBORHOODS = `
	SELECT 
		s.street_id,
		s.street_name,
		s.street_distance,
		to_char(s.street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
	FROM streets s
	INNER JOIN neighborhood_streets ns ON s.street_id = ns.street_id
	INNER JOIN neighborhoods n ON n.neighborhood_id = ns.neighborhood_id
	WHERE s.street_deleted_at IS NULL AND ns.neighborhood_id = $1
`

const CHANGE_STREET = `
	UPDATE streets s SET
		street_name = (
			CASE
				WHEN length($2) > 0 THEN $2
				ELSE s.street_name 
			END
		),
		street_distance = (
			CASE
				WHEN $3 > 0 THEN $3
				ELSE s.street_distance
			END
		)
	WHERE s.street_id = $1
	RETURNING
		s.*,
		to_char(s.street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
`

const ADD_STREET = `
	INSERT INTO streets (
		street_name,
		street_distance
	) VALUES ($1, $2)
	RETURNING
		*,
		to_char(street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
`

const ADD_NEIGHBORHOOD_STREETS = `
	INSERT INTO neighborhood_streets (
		neighborhood_id,
		street_id
	) VALUES ($1, $2)
	RETURNING *
`

const DELETE_NEIGHBORHOOD_STREETS = `
	DELETE FROM neighborhood_streets 
	WHERE street_id = $1
`

const DISABLE_STREET = `
	UPDATE streets 
		SET street_deleted_at = current_timestamp
	WHERE street_id = $1
	RETURNING
		*,
		to_char(street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
`

const ENABLE_STREET = `
	UPDATE streets 
		SET street_deleted_at = NULL
	WHERE street_id = $1
	RETURNING
		*,
		to_char(street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
`

const DISABLED_STREETS = `
	SELECT 
		s.street_id,
		s.street_name,
		s.street_distance,
		to_char(s.street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
	FROM streets s
	INNER JOIN neighborhood_streets ns ON s.street_id = ns.street_id
	INNER JOIN neighborhoods n ON n.neighborhood_id = ns.neighborhood_id
	WHERE street_deleted_at IS NOT NULL AND
	CASE 
		WHEN $1 > 0 THEN n.region_id = $1
		ELSE TRUE
	END AND
	CASE 
		WHEN $2 > 0 THEN n.neighborhood_id = $2
		ELSE TRUE
	END AND
	CASE 
		WHEN $3 > 0 THEN s.street_id = $3
		ELSE TRUE
	END
`


export default {
	DELETE_NEIGHBORHOOD_STREETS,
	STREETS_FOR_NEIGHBORHOODS,
	ADD_NEIGHBORHOOD_STREETS,
	STREETS_FOR_AREAS,
	DISABLED_STREETS,	
	DISABLE_STREET,
	ENABLE_STREET,
	CHANGE_STREET,
	ADD_STREET,
	STREETS,
}
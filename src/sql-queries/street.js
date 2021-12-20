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

const CHANGE_STREET = `
	UPDATE streets s SET
		street_name = (
			CASE
				
			END
		),
		street_distance = (
			CASE
				
			END
		)
	WHERE street_id = $1
	RETURNING
		*,
		to_char(s.street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
`

const ADD_STREET = `
	INSERT INTO streets (
		street_name,
		street_distance
	) VALUES ($1, $2)
	RETURNING
		*,
		to_char(s.street_created_at, 'DD-MM-YYYY HH24:MI:SS') street_created_at
`

const ADD_NEIGHBORHOOD_STREETS = `
	INSERT INTO neighborhood_streets (
		neighborhood_id,
		street_id
	) VALUES ($1, $2)
	RETURNING *
`
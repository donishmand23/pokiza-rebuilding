const NEIGHBORHOODS = `
	SELECT 
		neighborhood_id,
		neighborhood_name,
		neighborhood_distance,
		to_char(neighborhood_created_at, 'DD-MM-YYYY HH24:MI:SS') neighborhood_created_at,
		region_id
	FROM neighborhoods
	WHERE neighborhood_deleted_at IS NULL AND
	CASE 
		WHEN $1 > 0 THEN region_id = $1
		ELSE TRUE
	END AND
	CASE 
		WHEN $2 > 0 THEN neighborhood_id = $2
		ELSE TRUE
	END 
`

const CHANGE_NEIGHBORHOOD = `
	UPDATE neighborhoods n SET
		neighborhood_name = (
			CASE
				WHEN length($2) > 0 THEN $2
				ELSE n.neighborhood_name
			END
		),
		neighborhood_distance = (
			CASE
				WHEN $3 > 0 THEN $3
				ELSE n.neighborhood_distance
			END
		),
		region_id = (
			CASE
				WHEN $4 > 0 THEN $4
				ELSE n.region_id
			END
		)
	WHERE n.neighborhood_id = $1
	RETURNING
		n.*,
		to_char(n.neighborhood_created_at, 'DD-MM-YYYY HH24:MI:SS') neighborhood_created_at
`

const ADD_NEIGHBORHOOD = `
	INSERT INTO neighborhoods (
		region_id,
		neighborhood_name,
		neighborhood_distance
	) VALUES ($1, $2, $3)
	RETURNING 
		*,
		to_char(neighborhood_created_at, 'DD-MM-YYYY HH24:MI:SS') neighborhood_created_at
`

export default {
	CHANGE_NEIGHBORHOOD,
	ADD_NEIGHBORHOOD,
	NEIGHBORHOODS,
}
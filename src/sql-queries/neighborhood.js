const NEIGHBORHOODS = `
	SELECT 
		DISTINCT ON(n.neighborhood_id)
		n.neighborhood_id,
		n.neighborhood_name,
		n.neighborhood_distance,
		to_char(n.neighborhood_created_at, 'YYYY-MM-DD HH24:MI:SS') neighborhood_created_at,
		n.region_id
	FROM neighborhoods n
	INNER JOIN regions r ON r.region_id = n.region_id AND r.region_deleted_at IS NULL
	INNER JOIN states s ON r.state_id = s.state_id AND s.state_deleted_at IS NULL
	INNER JOIN branches b ON b.branch_id = r.branch_id AND b.branch_deleted_at IS NULL
	WHERE n.neighborhood_deleted_at IS NULL AND
	CASE 
		WHEN $1 > 0 THEN n.region_id = $1
		ELSE TRUE
	END AND
	CASE 
		WHEN $2 > 0 THEN n.neighborhood_id = $2
		ELSE TRUE
	END AND
	CASE 
		WHEN $3 > 0 THEN s.state_id = $3
		ELSE TRUE
	END 
	ORDER BY n.neighborhood_name ASC
`

const NEIGHBORHOODS_FOR_STREETS = `
	SELECT 
		DISTINCT ON(n.neighborhood_id)
		n.neighborhood_id,
		n.neighborhood_name,
		n.neighborhood_distance,
		to_char(n.neighborhood_created_at, 'YYYY-MM-DD HH24:MI:SS') neighborhood_created_at,
		n.region_id
	FROM neighborhoods n
	INNER JOIN neighborhood_streets ns ON n.neighborhood_id = ns.neighborhood_id
	INNER JOIN streets s ON s.street_id = ns.street_id
	WHERE n.neighborhood_deleted_at IS NULL AND s.street_id = $1
	ORDER BY n.neighborhood_name ASC
`

const NEIGHBORHOODS_FOR_AREAS = `
	SELECT 
		DISTINCT ON(n.neighborhood_id)
		n.neighborhood_id,
		n.neighborhood_name,
		n.neighborhood_distance,
		to_char(n.neighborhood_created_at, 'YYYY-MM-DD HH24:MI:SS') neighborhood_created_at,
		n.region_id
	FROM neighborhoods n
	INNER JOIN neighborhood_streets ns ON ns.neighborhood_id = n.neighborhood_id
	INNER JOIN streets s ON s.street_id = ns.street_id
	INNER JOIN street_areas sa ON sa.street_id = s.street_id
	INNER JOIN areas a ON a.area_id = sa.area_id
	WHERE n.neighborhood_deleted_at IS NULL AND a.area_id = $1
	ORDER BY n.neighborhood_name ASC
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
		to_char(n.neighborhood_created_at, 'YYYY-MM-DD HH24:MI:SS') neighborhood_created_at
`

const ADD_NEIGHBORHOOD = `
	INSERT INTO neighborhoods (
		region_id,
		neighborhood_name,
		neighborhood_distance
	) VALUES ($1, $2, $3)
	RETURNING 
		*,
		to_char(neighborhood_created_at, 'YYYY-MM-DD HH24:MI:SS') neighborhood_created_at
`

const DISABLE_NEIGHBORHOOD = `
	UPDATE neighborhoods 
		SET neighborhood_deleted_at = current_timestamp
	WHERE neighborhood_id = $1
	RETURNING
		*,
		to_char(neighborhood_created_at, 'YYYY-MM-DD HH24:MI:SS') neighborhood_created_at
`

const ENABLE_NEIGHBORHOOD = `
	UPDATE neighborhoods 
		SET neighborhood_deleted_at = NULL
	WHERE neighborhood_id = $1
	RETURNING
		*,
		to_char(neighborhood_created_at, 'YYYY-MM-DD HH24:MI:SS') neighborhood_created_at
`

const DISABLED_NEIGHBORHOODS = `
	SELECT 
		DISTINCT ON(n.neighborhood_id)
		n.neighborhood_id,
		n.neighborhood_name,
		n.neighborhood_distance,
		to_char(n.neighborhood_created_at, 'YYYY-MM-DD HH24:MI:SS') neighborhood_created_at,
		n.region_id
	FROM neighborhoods n
	LEFT JOIN regions r ON r.region_id = n.region_id
	WHERE n.neighborhood_deleted_at IS NOT NULL AND
	CASE
		WHEN $1 > 0 THEN n.region_id = $1
		ELSE TRUE
	END AND
	CASE 
		WHEN $2 > 0 THEN n.neighborhood_id = $2
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($3::INT[], 1) > 0 THEN r.branch_id = ANY($3::INT[])
		ELSE TRUE
	END
	ORDER BY n.neighborhood_name ASC
`


export default {
	NEIGHBORHOODS_FOR_STREETS,
	NEIGHBORHOODS_FOR_AREAS,
	DISABLED_NEIGHBORHOODS,
	DISABLE_NEIGHBORHOOD,
	ENABLE_NEIGHBORHOOD,
	CHANGE_NEIGHBORHOOD,
	ADD_NEIGHBORHOOD,
	NEIGHBORHOODS,
}
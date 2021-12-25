const AREAS = `
	SELECT 
		a.area_id,
		a.area_name,
		a.area_distance,
		to_char(a.area_created_at, 'YYYY-MM-DD HH24:MI:SS') area_created_at
	FROM areas a
	INNER JOIN street_areas sa ON a.area_id = sa.area_id
	INNER JOIN streets s ON s.street_id = sa.street_id AND s.street_deleted_at IS NULL
	INNER JOIN neighborhood_streets ns ON ns.street_id = s.street_id
	INNER JOIN neighborhoods n ON n.neighborhood_id = ns.neighborhood_id AND n.neighborhood_deleted_at IS NULL
	INNER JOIN regions r ON r.region_id = n.region_id AND r.region_deleted_at IS NULL
	INNER JOIN states st ON r.state_id = st.state_id AND st.state_deleted_at IS NULL
	INNER JOIN branches b ON b.branch_id = r.branch_id AND b.branch_deleted_at IS NULL
	WHERE a.area_deleted_at IS NULL AND
	CASE 
		WHEN $1 > 0 THEN r.region_id = $1
		ELSE TRUE
	END AND
	CASE 
		WHEN $2 > 0 THEN n.neighborhood_id = $2
		ELSE TRUE
	END AND
	CASE 
		WHEN $3 > 0 THEN sa.street_id = $3
		ELSE TRUE
	END AND
	CASE 
		WHEN $4 > 0 THEN a.area_id = $4
		ELSE TRUE
	END
`

const AREAS_FOR_STREETS = `
	SELECT 
		a.area_id,
		a.area_name,
		a.area_distance,
		to_char(a.area_created_at, 'YYYY-MM-DD HH24:MI:SS') area_created_at
	FROM areas a
	INNER JOIN street_areas sa ON a.area_id = sa.area_id
	INNER JOIN streets s ON s.street_id = sa.street_id
	WHERE a.area_deleted_at IS NULL AND sa.street_id = $1
`

const CHANGE_AREA = `
	UPDATE areas a SET
		area_name = (
			CASE
				WHEN length($2) > 0 THEN $2
				ELSE a.area_name
			END
		),
		area_distance = (
			CASE
				WHEN $3 > 0 THEN $3
				ELSE a.area_distance
			END
		)
	WHERE a.area_id = $1
	RETURNING
		a.*,
		to_char(a.area_created_at, 'YYYY-MM-DD HH24:MI:SS') area_created_at
`

const ADD_AREA = `
	INSERT INTO areas (
		area_name,
		area_distance
	) VALUES ($1, $2)
	RETURNING
		*,
		to_char(area_created_at, 'YYYY-MM-DD HH24:MI:SS') area_created_at
`

const ADD_STREET_AREAS = `
	INSERT INTO street_areas (
		street_id,
		area_id
	) VALUES ($1, $2)
	RETURNING *
`

const DELETE_STREET_AREAS = `
	DELETE FROM street_areas 
	WHERE area_id = $1
`

const DISABLE_AREA = `
	UPDATE areas 
		SET area_deleted_at = current_timestamp
	WHERE area_id = $1
	RETURNING
		*,
		to_char(area_created_at, 'YYYY-MM-DD HH24:MI:SS') area_created_at
`

const ENABLE_AREA = `
	UPDATE areas 
		SET area_deleted_at = NULL
	WHERE area_id = $1
	RETURNING
		*,
		to_char(area_created_at, 'YYYY-MM-DD HH24:MI:SS') area_created_at
`

const DISABLED_AREAS = `
	SELECT 
		a.area_id,
		a.area_name,
		a.area_distance,
		to_char(a.area_created_at, 'YYYY-MM-DD HH24:MI:SS') area_created_at
	FROM areas a
	INNER JOIN street_areas sa ON a.area_id = sa.area_id
	INNER JOIN streets s ON s.street_id = sa.street_id
	INNER JOIN neighborhood_streets ns ON ns.street_id = s.street_id
	INNER JOIN neighborhoods n ON n.neighborhood_id = ns.neighborhood_id
	WHERE area_deleted_at IS NOT NULL AND
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
	END AND
	CASE 
		WHEN $4 > 0 THEN a.area_id = $4
		ELSE TRUE
	END
`


export default {
	DELETE_STREET_AREAS,
	AREAS_FOR_STREETS,
	ADD_STREET_AREAS,
	DISABLED_AREAS,
	DISABLE_AREA,
	ENABLE_AREA,
	CHANGE_AREA,
	ADD_AREA,
	AREAS,
}
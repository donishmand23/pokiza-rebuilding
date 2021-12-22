const REGIONS = `
	SELECT 
		region_id,
		region_name,
		state_id,
		branch_id,
		to_char(region_created_at, 'DD-MM-YYYY HH24:MI:SS') region_created_at
	FROM regions
	WHERE region_deleted_at IS NULL AND
	CASE 
		WHEN $1 > 0 THEN state_id = $1
		ELSE TRUE
	END AND
	CASE 
		WHEN $2 > 0 THEN region_id = $2
		ELSE TRUE
	END 
`

const REGIONS_FOR_STREETS = `
	SELECT 
		r.region_id,
		r.region_name,
		r.state_id,
		r.branch_id,
		to_char(r.region_created_at, 'DD-MM-YYYY HH24:MI:SS') region_created_at
	FROM regions r
	NATURAL JOIN neighborhoods n
	INNER JOIN neighborhood_streets ns ON ns.neighborhood_id = n.neighborhood_id
	WHERE region_deleted_at IS NULL AND ns.street_id = $1
`

const CHANGE_REGION = `
	UPDATE regions r SET 
		region_name = (
			CASE
				WHEN length($2) > 0 THEN $2
				ELSE r.region_name
			END
		),
		state_id = (
			CASE
				WHEN $3 > 0 THEN $3
				ELSE r.state_id
			END
		),
		branch_id = (
			CASE
				WHEN $4 > 0 THEN $4
				ELSE r.branch_id
			END
		)
	WHERE r.region_id = $1
	RETURNING 
		r.*,
		to_char(r.region_created_at, 'DD-MM-YYYY HH24:MI:SS') region_created_at
`

const ADD_REGION = `
	INSERT INTO regions (
		state_id,
		region_name,
		branch_id
	) VALUES ($1, $2, $3)
	RETURNING 
		*,
		to_char(region_created_at, 'DD-MM-YYYY HH24:MI:SS') region_created_at
`

const DISABLE_REGION = `
	UPDATE regions 
		SET region_deleted_at = current_timestamp
	WHERE region_id = $1
	RETURNING
		*,
		to_char(region_created_at, 'DD-MM-YYYY HH24:MI:SS') region_created_at
`

const ENABLE_REGION = `
	UPDATE regions 
		SET region_deleted_at = NULL
	WHERE region_id = $1
	RETURNING
		*,
		to_char(region_created_at, 'DD-MM-YYYY HH24:MI:SS') region_created_at
`

const DISABLED_REGIONS = `
	SELECT 
		region_id,
		region_name,
		state_id,
		branch_id,
		to_char(region_created_at, 'DD-MM-YYYY HH24:MI:SS') region_created_at
	FROM regions
	WHERE region_deleted_at IS NOT NULL AND
	CASE 
		WHEN $1 > 0 THEN region_id = $1
		ELSE TRUE
	END
`


export default {
	REGIONS_FOR_STREETS,
	DISABLED_REGIONS,
	DISABLE_REGION,
	ENABLE_REGION,
	CHANGE_REGION,
	ADD_REGION,
	REGIONS,
}
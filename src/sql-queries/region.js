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


export default {
	CHANGE_REGION,
	ADD_REGION,
	REGIONS,
}
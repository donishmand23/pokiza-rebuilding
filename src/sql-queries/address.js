const ADDRESS = `
	SELECT
		a.address_id,
		a.state_id,
		a.region_id,
		a.neighborhood_id,
		a.street_id,
		a.area_id,
		a.address_target,
		a.address_home_number,
		to_char(a.address_created_at, 'YYYY-MM-DD HH24:MI:SS') address_created_at
	FROM addresses a
	WHERE a.address_deleted_at IS NULL AND
	CASE 
		WHEN $1 > 0 THEN a.address_id = $1
		ELSE true
	END
`

const ADD_ADDRESS = `
	INSERT INTO addresses (
		state_id,
		region_id,
		neighborhood_id,
		street_id,
		area_id,
		address_target,
		address_home_number
	) VALUES ($1, $2, $3, $4, $5, $6, $7)
	RETURNING *
`


export default {
	ADD_ADDRESS,
	ADDRESS,
}
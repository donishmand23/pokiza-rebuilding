const STATES = `
	SELECT 
		state_id,
		state_name,
		to_char(state_created_at, 'DD-MM-YYYY HH24:MI:SS') state_created_at
	FROM states
	WHERE state_deleted_at IS NULL AND
	CASE 
		WHEN $1 > 0 THEN state_id = $1
		ELSE true
	END
`

const CHANGE_STATE = `
	UPDATE states
		SET state_name = $2
	WHERE state_id = $1
	RETURNING
		*,
		to_char(state_created_at, 'DD-MM-YYYY HH24:MI:SS') state_created_at
`

const ADD_STATE = ` 
	INSERT INTO states (
		state_name
	) VALUES ($1)
	RETURNING
		*,
		to_char(state_created_at, 'DD-MM-YYYY HH24:MI:SS') state_created_at
`


export default{
	CHANGE_STATE,
	ADD_STATE,
	STATES,
}
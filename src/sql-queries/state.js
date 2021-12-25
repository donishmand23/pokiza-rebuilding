const STATES = `
	SELECT 
		state_id,
		state_name,
		to_char(state_created_at, 'YYYY-MM-DD HH24:MI:SS') state_created_at
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
		to_char(state_created_at, 'YYYY-MM-DD HH24:MI:SS') state_created_at
`

const ADD_STATE = ` 
	INSERT INTO states (
		state_name
	) VALUES ($1)
	RETURNING
		*,
		to_char(state_created_at, 'YYYY-MM-DD HH24:MI:SS') state_created_at
`

const DISABLE_STATE = ` 
	UPDATE states SET
		state_deleted_at = current_timestamp
	WHERE state_id = $1
	RETURNING
		*,
		to_char(state_created_at, 'YYYY-MM-DD HH24:MI:SS') state_created_at
`

const ENABLE_STATE = ` 
	UPDATE states SET
		state_deleted_at = NULL
	WHERE state_id = $1
	RETURNING
		*,
		to_char(state_created_at, 'YYYY-MM-DD HH24:MI:SS') state_created_at
`

const DISABLED_STATES = `
	SELECT 
		state_id,
		state_name,
		to_char(state_created_at, 'YYYY-MM-DD HH24:MI:SS') state_created_at
	FROM states
	WHERE state_deleted_at IS NOT NULL AND
	CASE 
		WHEN $1 > 0 THEN state_id = $1
		ELSE true
	END
`

export default{
	DISABLED_STATES,
	DISABLE_STATE,
	ENABLE_STATE,
	CHANGE_STATE,
	ADD_STATE,
	STATES,
}
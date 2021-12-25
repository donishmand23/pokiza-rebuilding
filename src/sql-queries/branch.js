const BRANCHES = ` 
	SELECT 
		branch_id,
		branch_name,
		to_char(branch_created_at, 'YYYY-MM-DD HH24:MI:SS') branch_created_at
	FROM branches
	WHERE branch_deleted_at IS NULL AND
	CASE 
		WHEN $1 > 0 THEN branch_id = $1
		ELSE TRUE
	END
`

const ADD_BRANCH = `
	INSERT INTO branches(
		branch_name
	) VALUES($1)
	RETURNING 
		branch_id,
		branch_name,
		to_char(branch_created_at, 'YYYY-MM-DD HH24:MI:SS') branch_created_at
`

const CHANGE_BRANCH = `
	UPDATE branches SET 
		branch_name = $1 
	WHERE branch_id = $2
	RETURNING
		branch_id,
		branch_name,
		to_char(branch_created_at, 'YYYY-MM-DD HH24:MI:SS') branch_created_at
`


export default {
	CHANGE_BRANCH,
	ADD_BRANCH,
	BRANCHES,
}
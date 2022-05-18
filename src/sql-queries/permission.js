const ADD_PERMISSION = ` 
	WITH new_permission AS (
		INSERT INTO permission_sets (
			staff_id,
			permission_action,
			branch_id
		) VALUES ($1, $2, $3)
		RETURNING *
	) SELECT
		p.permission_action,
		p.permission_model
	FROM new_permission np
	INNER JOIN permissions p ON p.permission_action = np.permission_action
	WHERE np.permission_set_id IS NOT NULL
`

const DELETE_PERMISSION = `
	WITH deleted_permission AS (
		DELETE FROM permission_sets
		WHERE staff_id = $1 AND permission_action = $2 AND branch_id = $3
		RETURNING *
	) SELECT
		p.permission_action,
		p.permission_model
	FROM deleted_permission np
	INNER JOIN permissions p ON p.permission_action = np.permission_action
	WHERE np.permission_set_id IS NOT NULL
`

const DELETE_ALL_PERMISSIONS = `
	DELETE FROM permission_sets
	WHERE staff_id = $1 AND branch_id = $2
	RETURNING * 
`

const PERMISSIONS = ` 
	SELECT
		permission_action,
		permission_model
	FROM permissions
	ORDER BY permission_action ASC
`

const BRANCHES_BY_USER = ` 
	SELECT DISTINCT ON (ps.branch_id)
		b.branch_id,
		b.branch_name,
		ps.staff_id
	FROM branches b
	INNER JOIN permission_sets ps ON ps.branch_id = b.branch_id
	WHERE ps.staff_id = $1
	ORDER BY ps.branch_id
`

const PERMISSION_GROUPS = ` 
	SELECT
		group_id,
		group_name
	FROM permission_groups
	WHERE group_deleted_at IS NULL AND
	CASE
		WHEN $1 > 0 THEN group_id = $1
		ELSE true
	END
`

const PERMISSIONS_BY_GROUP = ` 
	SELECT
		p.permission_action,
		p.permission_model
	FROM permissions p
	INNER JOIN permission_group_sets gs ON gs.permission_action = p.permission_action
	WHERE
	CASE
		WHEN $1 > 0 THEN gs.group_id = $1
		ELSE true
	END
	ORDER BY p.permission_action ASC
`

const PERMISSIONS_BY_BRANCH = ` 
	SELECT
		p.permission_action,
		p.permission_model
	FROM permissions p
	LEFT OUTER JOIN permission_sets ps ON ps.permission_action = p.permission_action AND ps.staff_id = $2
	WHERE ps.branch_id = $1
	ORDER BY p.permission_action ASC
`

const ADD_PERMISSION_GROUP = ` 
	INSERT INTO permission_groups (
		group_name
	) VALUES ($1)
	RETURNING *
`

const EDIT_PERMISSION_GROUP = ` 
	UPDATE permission_groups SET
		group_name = $2
	WHERE group_id = $1
	RETURNING *
`

const ADD_PERMISSION_GROUP_ACTIONS = ` 
	INSERT INTO permission_group_sets (
		group_id,
		permission_action
	) VALUES ($1, $2)
	RETURNING *
`

const DELETE_PERMISSION_GROUP = ` 
	DELETE FROM permission_groups
	WHERE group_id = $1 AND group_id <> 1
	RETURNING *
`

const DELETE_PERMISSION_GROUP_ACTIONS = `
	DELETE FROM permission_group_sets WHERE group_id = $1
`

const PERMISSION_SETS = `
	SELECT
		staff_id,
		branch_id,
		permission_set_id,
		permission_action,
		permission_set_created_at
	FROM permission_sets
	WHERE staff_id = $1 AND permission_action = ANY($2::INT[])
`


export default {
	DELETE_PERMISSION_GROUP_ACTIONS,
	ADD_PERMISSION_GROUP_ACTIONS,
	DELETE_PERMISSION_GROUP,
	DELETE_ALL_PERMISSIONS,
	PERMISSIONS_BY_BRANCH,
	EDIT_PERMISSION_GROUP,
	PERMISSIONS_BY_GROUP,
	ADD_PERMISSION_GROUP,
	DELETE_PERMISSION,
	PERMISSION_GROUPS,
	BRANCHES_BY_USER,
	PERMISSION_SETS,
	ADD_PERMISSION,
	PERMISSIONS,
}
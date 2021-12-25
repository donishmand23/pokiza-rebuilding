const SOCIAL_SETS = ` 
	SELECT
		social_set_id,
		social_set_name,
		social_set_icon,
		to_char(social_set_created_at, 'YYYY-MM-DD HH24:MI:SS') social_set_created_at
	FROM social_sets
	WHERE
	CASE
		WHEN $1 > 0 THEN social_set_id = $1
		ELSE TRUE
	END
`

const ADD_SOCIAL_SET = ` 
	INSERT INTO social_sets (
		social_set_name,
		social_set_icon
	) VALUES ($1, $2)
	RETURNING
		*,
		to_char(social_set_created_at, 'YYYY-MM-DD HH24:MI:SS') social_set_created_at
`

const CHANGE_SOCIAL_SET = ` 
	UPDATE social_sets sc SET
		social_set_name = (
			CASE
				WHEN length($2) > 0 THEN $2
				ELSE sc.social_set_name
			END
		),
		social_set_icon = (
			CASE
				WHEN length($3) > 0 THEN $3
				ELSE sc.social_set_icon
			END
		)
	WHERE sc.social_set_id = $1
	RETURNING
		*,
		to_char(social_set_created_at, 'YYYY-MM-DD HH24:MI:SS') social_set_created_at
`


export default {
	SOCIAL_SETS,
	ADD_SOCIAL_SET,
	CHANGE_SOCIAL_SET,
}

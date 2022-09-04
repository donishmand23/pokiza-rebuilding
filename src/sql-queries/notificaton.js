const NOTIFICATIONS = `
	SELECT
		notification_id,
		notification_from,
		notification_to,
		notification_title,
		notification_body,
		notification_img,
		to_char(notification_created_at, 'YYYY-MM-DD HH24:MI:SS') notification_created_at
	FROM notifications
	WHERE notification_to = $1
	ORDER BY notification_id DESC
`

const SEND_NOTIFICATION = `
	INSERT INTO notifications(
		notification_from,
		notification_to,
		notification_title,
		notification_body,
		notification_img
	) SELECT $1, u.user_id, $2, $3, $4 FROM users u
	LEFT JOIN staffs s ON s.user_id = u.user_id
	LEFT JOIN clients c ON c.user_id = u.user_id
	WHERE u.user_deleted_contact IS NULL AND
	CASE
		WHEN ARRAY_LENGTH($5::INT[], 1) > 0 THEN u.branch_id = ANY($5::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN $6 = 'staff' THEN s.staff_id IS NOT NULL
		WHEN $6 = 'client' THEN c.client_id IS NOT NULL
		ELSE TRUE
	END AND
	CASE
		WHEN $6 = 'staff' THEN s.staff_id <> $1
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($7::INT[], 1) > 0 THEN u.user_id = ANY($7::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN $8 = ANY(ARRAY[1, 2]) THEN u.user_gender = $8
		ELSE TRUE
	END
	RETURNING *
`

const DELETE_NOTIFICATIONS = `
	DELETE FROM notifications
	WHERE notification_to = $1 AND notification_id = ANY($2::INT[])
	RETURNING *
`

export default {
	DELETE_NOTIFICATIONS,
	SEND_NOTIFICATION,
	NOTIFICATIONS
}
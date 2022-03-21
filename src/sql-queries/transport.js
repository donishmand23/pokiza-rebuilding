const TRANSPORTS = `
	SELECT
		t.transport_id,
		t.transport_model,
		t.transport_color,
		t.transport_number,
		t.transport_summary,
		t.branch_id,
		t.transport_broken,
		t.transport_img,
		count(*) OVER() as full_count,
		to_char(t.transport_created_at, 'YYYY-MM-DD HH24:MI:SS') transport_created_at
	FROM transports t
	LEFT JOIN (
		SELECT staff_id, transport_id
		FROM transport_registration
		ORDER BY registration_id DESC
		LIMIT 1
	) tr ON tr.transport_id = t.transport_id
	WHERE
	CASE 
		WHEN $3 = FALSE THEN t.transport_deleted_at IS NULL
		WHEN $3 = TRUE THEN t.transport_deleted_at IS NOT NULL
		ELSE TRUE
	END AND
	CASE
		WHEN $4 > 0 THEN t.transport_id = $4
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($5::INT[], 1) > 0 THEN t.branch_id = ANY($5::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN LENGTH($6) > 0 THEN t.transport_broken = CAST($6 AS BOOLEAN)
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($7) >= 3 THEN (
			t.transport_model ILIKE CONCAT('%', $7::VARCHAR, '%') OR
			t.transport_color ILIKE CONCAT('%', $7::VARCHAR, '%') OR
			t.transport_number ILIKE CONCAT('%', $7::VARCHAR, '%') OR
			t.transport_summary ILIKE CONCAT('%', $7::VARCHAR, '%')
		) WHEN LENGTH($7) > 0 THEN (
			t.transport_id::VARCHAR = $7::VARCHAR
		) ELSE TRUE
	END AND
	CASE
		WHEN $8 > 0 THEN tr.staff_id = $8
		ELSE TRUE
	END AND
	CASE
		WHEN $9 > 0 OR $10 > 0 THEN t.transport_id = (
			SELECT transport_id FROM
			order_bindings WHERE
			CASE
				WHEN $9 > 0 THEN order_id = $9
				ELSE TRUE
			END AND
			CASE
				WHEN $10 > 0 THEN product_id = $10
				ELSE TRUE
			END
		)
		ELSE TRUE
	END
	ORDER BY
	(CASE WHEN $11 = 1 AND $12 = 2 THEN t.transport_id END) ASC,
	(CASE WHEN $11 = 1 AND $12 = 1 THEN t.transport_id END) DESC
	OFFSET $1 ROWS FETCH FIRST $2 ROW ONLY
`

const TRANSPORT = `
	SELECT
		t.transport_id,
		t.transport_model,
		t.transport_color,
		t.transport_number,
		t.transport_summary,
		t.branch_id,
		t.transport_broken,
		t.transport_img,
		count(*) OVER() as full_count,
		to_char(t.transport_created_at, 'YYYY-MM-DD HH24:MI:SS') transport_created_at
	FROM transports t
	LEFT JOIN (
		SELECT staff_id, transport_id
		FROM transport_registration
		ORDER BY registration_id DESC
		LIMIT 1
	) tr ON tr.transport_id = t.transport_id
	WHERE
	CASE 
		WHEN $1 = FALSE THEN t.transport_deleted_at IS NULL
		WHEN $1 = TRUE THEN t.transport_deleted_at IS NOT NULL
		ELSE TRUE
	END AND
	CASE
		WHEN $2 > 0 THEN t.transport_id = $2
		ELSE TRUE
	END AND
	CASE
		WHEN $3 > 0 THEN tr.staff_id = $3
		ELSE TRUE
	END AND
	CASE
		WHEN $4 > 0 OR $5 > 0 THEN t.transport_id = (
			SELECT transport_id FROM
			order_bindings WHERE
			CASE
				WHEN $4 > 0 THEN order_id = $4
				ELSE TRUE
			END AND
			CASE
				WHEN $5 > 0 THEN product_id = $5
				ELSE TRUE
			END
		)
		ELSE TRUE
	END
`

const DRIVERS = `
	SELECT
		staff_id,
		to_char(registered_at, 'YYYY-MM-DD HH24:MI:SS') registered_at,
		to_char(unregistered_at, 'YYYY-MM-DD HH24:MI:SS') unregistered_at
	FROM transport_registration
	WHERE transport_id = $1
	ORDER BY registration_id ASC
`

const ADD_TRANSPORT = `
	INSERT INTO transports (
		branch_id,
		transport_model,
		transport_color,
		transport_number,
		transport_summary,
		transport_img
	) VALUES ($1, $2, $3, $4, $5, $6)
	RETURNING *,
	to_char(transport_created_at, 'YYYY-MM-DD HH24:MI:SS') transport_created_at
`

const CHANGE_TRANSPORT = `
	UPDATE transports t SET
		branch_id = (
			CASE WHEN $2 > 0 THEN $2 ELSE t.branch_id END
		),
		transport_model = (
			CASE WHEN LENGTH($3) > 0 THEN $3 ELSE t.transport_model END
		),
		transport_color = (
			CASE WHEN LENGTH($4) > 0 THEN $4 ELSE t.transport_color END
		),
		transport_number = (
			CASE WHEN LENGTH($5) > 0 THEN $5 ELSE t.transport_number END
		),
		transport_summary = (
			CASE WHEN LENGTH($6) > 0 THEN $6 ELSE t.transport_summary END
		),
		transport_img = (
			CASE WHEN LENGTH($7) > 0 THEN $7 ELSE t.transport_img END
		)
	FROM transports ot
	WHERE t.transport_deleted_at IS NULL AND t.transport_id = $1 AND
	ot.transport_id = $1
	RETURNING t.*,
	t.branch_id as new_branch_id,
	t.transport_model as new_name,
	t.transport_color as new_color,
	t.transport_number as new_number,
	t.transport_summary as new_summary,
	t.transport_img as new_file,
	ot.branch_id as old_branch_id,
	ot.transport_model as old_name,
	ot.transport_color as old_color,
	ot.transport_number as old_number,
	ot.transport_summary as old_summary,
	ot.transport_img as old_file,
	to_char(t.transport_created_at, 'YYYY-MM-DD HH24:MI:SS') transport_created_at
`

const CHECK_TRANSPORT = `
	SELECT
		t.transport_id,
		CASE
			WHEN tr.transport_id IS NULL THEN FALSE
			ELSE TRUE
		END AS registered,
		CASE
			WHEN ob.transport_id IS NULL THEN FALSE
			ELSE TRUE
		END AS bound
	FROM transports t
	LEFT JOIN (
		SELECT * FROM
		transport_registration
		WHERE unregistered_at IS NULL AND transport_id = $1
		ORDER BY registration_id DESC
		LIMIT 1
	) tr ON tr.transport_id = t.transport_id
	LEFT JOIN (
		SELECT * FROM order_bindings
		WHERE finished = FALSE AND transport_id = $1
		ORDER BY order_binding_id DESC
		LIMIT 1
	) ob ON ob.transport_id = t.transport_id
`

const DELETE_TRANSPORT = `
	UPDATE transports SET
		transport_deleted_at = current_timestamp
	WHERE transport_deleted_at IS NULL AND transport_id = $1
	RETURNING *
`

const RESTORE_TRANSPORT = `
	UPDATE transports SET
		transport_deleted_at = NULL
	WHERE transport_deleted_at IS NOT NULL AND transport_id = $1
	RETURNING *
`

const BIND_ORDER = `
	INSERT INTO order_bindings (
		order_id,
		product_id,
		order_binding_type,
		transport_id
	) SELECT $1, $2, $3, $4 FROM transports t
	LEFT JOIN branches b ON b.branch_id = t.branch_id AND b.branch_deleted_at IS NULL
	WHERE t.transport_id = $4
	RETURNING *
`

const UNBOUND_ORDER = `
	DELETE FROM order_bindings
	WHERE
	CASE
		WHEN $1 > 0 THEN order_id = $1
		ELSE FALSE
	END OR
	CASE
		WHEN $2 > 0 THEN product_id = $2
		ELSE FALSE
	END
	RETURNING *
`

const TRANSPORT_PHOTO = `
	SELECT transport_img FROM transports
	WHERE transport_id = $1
`


export default {
	RESTORE_TRANSPORT,
	DELETE_TRANSPORT,
	CHANGE_TRANSPORT,
	CHECK_TRANSPORT,
	TRANSPORT_PHOTO,
	UNBOUND_ORDER,
	ADD_TRANSPORT,
	BIND_ORDER,
	TRANSPORTS,
	TRANSPORT,
	DRIVERS,
}
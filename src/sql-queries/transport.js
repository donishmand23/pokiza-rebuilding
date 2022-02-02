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

const BIND_ORDER = `
	INSERT INTO order_bindings (
		order_id,
		product_id,
		order_binding_type,
		transport_id
	) VALUES ($1, $2, $3, $4)
	RETURNING *
`


export default {
	BIND_ORDER,
	TRANSPORTS,
	TRANSPORT,
	DRIVERS,
}
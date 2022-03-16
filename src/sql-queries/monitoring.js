const PRODUCT_STATUSES = ` 
	SELECT 
		o.branch_id,
		s.user_id,
		ops.product_status_code as old_value,
		ps.product_status_code as new_value,
		ps.product_id as section_id,
		to_char(ps.product_status_created_at, 'YYYY-MM-DD HH24:MI:SS') created_at,
		'changed' as operation_type,
		'products' as section_name,
		'status' as section_field
	FROM product_statuses ps
	LEFT JOIN staffs s ON s.staff_id = ps.staff_id
	LEFT JOIN products p ON p.product_id = ps.product_id
	LEFT JOIN orders o ON o.order_id = p.order_id
	INNER JOIN LATERAL (
		SELECT product_status_code FROM product_statuses
		WHERE product_status_id < ps.product_status_id AND
		product_id = ps.product_id
		ORDER BY product_status_id DESC
		LIMIT 1
	) ops ON ops.product_status_code IS NOT NULL
	WHERE
	CASE
		WHEN $1 > 0 THEN s.user_id = $1
		ELSE TRUE
	END AND
	CASE
		WHEN $2 > 0 THEN o.branch_id = $2
		ELSE TRUE
	END AND
	CASE
		WHEN $3 > 0 THEN ps.product_id = $3
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($4) > 0 THEN $4 = 'products'
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($5) > 0 THEN $5 = 'status'
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($6) > 0 THEN $6 = 'changed'
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($7::TIMESTAMPTZ[], 1) = 2 THEN (
			ps.product_status_created_at BETWEEN 
				($7::TIMESTAMPTZ[])[1] AND 
				(($7::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE (
			ps.product_status_created_at >= (CURRENT_DATE - '30 days'::INTERVAL)
		)
	END
	ORDER BY ps.product_id ASC, ps.product_status_id DESC
`

const ORDER_STATUSES = ` 
	SELECT 
		o.branch_id,
		s.user_id,
		oos.order_status_code as old_value,
		os.order_status_code as new_value,
		os.order_id as section_id,
		to_char(os.order_status_created_at, 'YYYY-MM-DD HH24:MI:SS') created_at,
		'changed' as operation_type,
		'orders' as section_name,
		'status' as section_field
	FROM order_statuses os
	LEFT JOIN staffs s ON s.staff_id = os.staff_id
	LEFT JOIN orders o ON o.order_id = os.order_id
	INNER JOIN LATERAL (
		SELECT order_status_code FROM order_statuses
		WHERE order_status_id < os.order_status_id AND
		order_id = os.order_id
		ORDER BY order_status_id DESC
		LIMIT 1
	) oos ON oos.order_status_code IS NOT NULL
	WHERE
	CASE
		WHEN $1 > 0 THEN s.user_id = $1
		ELSE TRUE
	END AND
	CASE
		WHEN $2 > 0 THEN o.branch_id = $2
		ELSE TRUE
	END AND
	CASE
		WHEN $3 > 0 THEN os.order_id = $3
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($4) > 0 THEN $4 = 'orders'
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($5) > 0 THEN $5 = 'status'
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($6) > 0 THEN $6 = 'changed'
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($7::TIMESTAMPTZ[], 1) = 2 THEN (
			os.order_status_created_at BETWEEN 
				($7::TIMESTAMPTZ[])[1] AND 
				(($7::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE (
			os.order_status_created_at >= (CURRENT_DATE - '30 days'::INTERVAL)
		)
	END
	ORDER BY os.order_id ASC, os.order_status_id DESC
`

const MONITORING = `
	SELECT
		m.monitoring_id,
		m.user_id,
		m.branch_id,
		m.operation_type,
		m.section_name,
		m.section_field,
		m.section_id,
		m.old_value,
		m.new_value,
		to_char(m.created_at, 'YYYY-MM-DD HH24:MI:SS') created_at
	FROM monitoring m
	WHERE
	CASE
		WHEN $1 > 0 THEN m.user_id = $1
		ELSE TRUE
	END AND
	CASE
		WHEN $2 > 0 THEN m.branch_id = $2
		ELSE TRUE
	END AND
	CASE
		WHEN $3 > 0 THEN m.section_id = $3
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($4) > 0 THEN m.section_name = $4
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($5) > 0 THEN m.section_field = $5
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($6) > 0 THEN m.operation_type = $6
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($7::TIMESTAMPTZ[], 1) = 2 THEN (
			m.created_at BETWEEN 
				($7::TIMESTAMPTZ[])[1] AND 
				(($7::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE (
			m.created_at >= (CURRENT_DATE - '30 days'::INTERVAL)
		)
	END
	ORDER BY m.section_id ASC, m.monitoring_id DESC
`

const ADD_MONITORING = `
	INSERT INTO monitoring (
		user_id,
		branch_id,
		operation_type,
		section_name,
		section_field,
		section_id,
		old_value,
		new_value
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	RETURNING *
`


export default {
	PRODUCT_STATUSES,
	ORDER_STATUSES,
	ADD_MONITORING,
	MONITORING
}
const ORDERS = `
	SELECT
		o.order_id,
		o.order_special,
		o.order_summary,
		o.client_id,
		o.branch_id,
		o.address_id,
		tm.bring_time_remaining,
		tm.delivery_time_remaining,
		count(*) OVER() as full_count,
		COALESCE( SUM(op.product_price) ,0) order_price,
		to_char(o.order_bring_time, 'YYYY-MM-DD HH24:MI:SS') order_bring_time,
		to_char(o.order_brougth_time, 'YYYY-MM-DD HH24:MI:SS') order_brougth_time,
		to_char(o.order_delivery_time, 'YYYY-MM-DD HH24:MI:SS') order_delivery_time,
		to_char(o.order_delivered_time, 'YYYY-MM-DD HH24:MI:SS') order_delivered_time,
		to_char(o.order_created_at, 'YYYY-MM-DD HH24:MI:SS') order_created_at
	FROM orders o
	NATURAL JOIN clients c
	INNER JOIN users u ON u.user_id = c.user_id
	LEFT JOIN addresses a ON a.address_id = o.address_id
	LEFT JOIN states sta ON sta.state_id = a.state_id
	LEFT JOIN regions r ON r.region_id = a.region_id
	LEFT JOIN neighborhoods n ON n.neighborhood_id = a.neighborhood_id
	LEFT JOIN streets st ON st.street_id = a.street_id
	LEFT JOIN areas ar ON ar.area_id = a.area_id
	LEFT JOIN order_bindings ob ON o.order_id = ob.order_id
	LEFT JOIN LATERAL (
		SELECT * FROM order_statuses WHERE order_id = o.order_id
		ORDER BY order_status_id DESC LIMIT 1
	) os ON os.order_id = o.order_id
	LEFT JOIN (
		SELECT
			order_id,
			EXTRACT( EPOCH FROM (order_bring_time::TIMESTAMPTZ - NOW()) ) AS bring_time_remaining,
			EXTRACT( EPOCH FROM (order_delivery_time::TIMESTAMPTZ - NOW()) ) AS delivery_time_remaining
		FROM orders
	) tm ON tm.order_id = o.order_id
	LEFT JOIN (
		SELECT
			p.order_id,
			p.product_id,
			s.service_name,
			CASE
				WHEN o.order_special = TRUE THEN s.service_price_special * p.product_size
				WHEN o.order_special = FALSE THEN s.service_price_simple * p.product_size
				ELSE 0
			END product_price
		FROM products p
		NATURAL JOIN orders o
		LEFT JOIN services s ON s.service_id = p.service_id
		WHERE p.product_deleted_at IS NULL
	) op ON op.order_id = o.order_id
	WHERE
	CASE 
		WHEN $3 = FALSE THEN o.order_deleted_at IS NULL
		WHEN $3 = TRUE THEN o.order_deleted_at IS NOT NULL
	END AND
	CASE
		WHEN $4 > 0 THEN o.order_id = $4
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($5::INT[], 1) > 0 THEN c.client_id = ANY($5::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($6::INT[], 1) > 0 THEN o.branch_id = ANY($6::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($7::INT[], 1) > 0 THEN os.order_status_code = ANY($7::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN LENGTH($8) > 0 THEN o.order_special = CAST($8 AS BOOLEAN)
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($9) >= 3 THEN (
			o.order_summary ILIKE CONCAT('%', $9::VARCHAR, '%') OR
			u.user_first_name ILIKE CONCAT('%', $9::VARCHAR, '%') OR
			u.user_last_name ILIKE CONCAT('%', $9::VARCHAR, '%') OR
	 		u.user_main_contact ILIKE CONCAT('%', $9::VARCHAR, '%') OR
	 		u.user_second_contact ILIKE CONCAT('%', $9::VARCHAR, '%')
		) WHEN LENGTH($9) > 0 THEN (
			o.order_id::VARCHAR = $9::VARCHAR
		) ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($10::TIMESTAMPTZ[], 1) = 2 THEN (
			o.order_bring_time BETWEEN ($10::TIMESTAMPTZ[])[1] AND (($10::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($11::TIMESTAMPTZ[], 1) = 2 THEN (
			o.order_brougth_time BETWEEN ($11::TIMESTAMPTZ[])[1] AND (($11::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($12::TIMESTAMPTZ[], 1) = 2 THEN (
			o.order_delivery_time BETWEEN ($12::TIMESTAMPTZ[])[1] AND (($12::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($13::TIMESTAMPTZ[], 1) = 2 THEN (
			o.order_delivered_time BETWEEN ($13::TIMESTAMPTZ[])[1] AND (($13::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($14::TIMESTAMPTZ[], 1) = 2 THEN (
			o.order_created_at BETWEEN ($14::TIMESTAMPTZ[])[1] AND (($14::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($15::INT[], 1) > 0 THEN sta.state_id = ANY($15::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($16::INT[], 1) > 0 THEN r.region_id = ANY($16::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($17::INT[], 1) > 0 THEN n.neighborhood_id = ANY($17::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($18::INT[], 1) > 0 THEN st.street_id = ANY($18::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($19::INT[], 1) > 0 THEN ar.area_id = ANY($19::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN $20 > 0 THEN ob.transport_id = $20
		ELSE TRUE
	END
	GROUP BY o.order_id, tm.bring_time_remaining, tm.delivery_time_remaining, u.user_first_name, u.user_last_name, os.order_status_code,
		     n.neighborhood_distance, st.street_distance, ar.area_distance
	ORDER BY
	(CASE WHEN $21 = 1 AND $22 = 2 THEN o.order_id END) ASC,
	(CASE WHEN $21 = 1 AND $22 = 1 THEN o.order_id END) DESC,
	(CASE WHEN $21 = 2 AND $22 = 2 THEN u.user_first_name END) ASC,
	(CASE WHEN $21 = 2 AND $22 = 1 THEN u.user_first_name END) DESC,
	(CASE WHEN $21 = 3 AND $22 = 2 THEN u.user_last_name END) ASC,
	(CASE WHEN $21 = 3 AND $22 = 1 THEN u.user_last_name END) DESC,
	(CASE WHEN $21 = 4 AND $22 = 2 THEN os.order_status_code END) ASC,
	(CASE WHEN $21 = 4 AND $22 = 1 THEN os.order_status_code END) DESC,
	(CASE WHEN $21 = 5 AND $22 = 2 THEN COALESCE( SUM(op.product_price) ,0) END) ASC,
	(CASE WHEN $21 = 5 AND $22 = 1 THEN COALESCE( SUM(op.product_price) ,0) END) DESC,
	(CASE WHEN $21 = 6 AND $22 = 2 THEN o.order_brougth_time END) ASC,
	(CASE WHEN $21 = 6 AND $22 = 1 THEN o.order_brougth_time END) DESC,
	(CASE WHEN $21 = 7 AND $22 = 2 THEN o.order_delivered_time END) ASC,
	(CASE WHEN $21 = 7 AND $22 = 1 THEN o.order_delivered_time END) DESC,
	(CASE WHEN $21 = 8 AND $22 = 2 THEN tm.bring_time_remaining END) ASC,
	(CASE WHEN $21 = 8 AND $22 = 1 THEN tm.bring_time_remaining END) DESC,
	(CASE WHEN $21 = 9 AND $22 = 2 THEN tm.delivery_time_remaining END) ASC,
	(CASE WHEN $21 = 9 AND $22 = 1 THEN tm.delivery_time_remaining END) DESC,
	(CASE WHEN $21 = 10 AND $22 = 2 AND n.neighborhood_distance IS NOT NULL THEN n.neighborhood_distance END) ASC,
	(CASE WHEN $21 = 10 AND $22 = 1 AND n.neighborhood_distance IS NOT NULL THEN n.neighborhood_distance END) DESC,
	(CASE WHEN $21 = 10 AND $22 = 2 AND st.street_distance IS NOT NULL THEN st.street_distance END) ASC,
	(CASE WHEN $21 = 10 AND $22 = 1 AND st.street_distance IS NOT NULL THEN st.street_distance END) DESC,
	(CASE WHEN $21 = 10 AND $22 = 2 AND ar.area_distance IS NOT NULL THEN ar.area_distance END) ASC,
	(CASE WHEN $21 = 10 AND $22 = 1 AND ar.area_distance IS NOT NULL THEN ar.area_distance END) DESC
	OFFSET $1 ROWS FETCH FIRST $2 ROW ONLY
`

const ORDER = `
	SELECT
		o.order_id,
		o.order_special,
		o.order_summary,
		o.client_id,
		o.branch_id,
		o.address_id,
		tm.bring_time_remaining,
		tm.delivery_time_remaining,
		to_char(o.order_bring_time, 'YYYY-MM-DD HH24:MI:SS') order_bring_time,
		to_char(o.order_brougth_time, 'YYYY-MM-DD HH24:MI:SS') order_brougth_time,
		to_char(o.order_delivery_time, 'YYYY-MM-DD HH24:MI:SS') order_delivery_time,
		to_char(o.order_delivered_time, 'YYYY-MM-DD HH24:MI:SS') order_delivered_time,
		to_char(o.order_created_at, 'YYYY-MM-DD HH24:MI:SS') order_created_at
	FROM orders o
	NATURAL JOIN clients c
	LEFT JOIN LATERAL (
		SELECT * FROM order_statuses WHERE order_id = o.order_id
		ORDER BY order_status_id DESC LIMIT 1
	) os ON os.order_id = o.order_id
	LEFT JOIN (
		SELECT
			order_id,
			EXTRACT( EPOCH FROM (order_bring_time::TIMESTAMPTZ - NOW()) ) AS bring_time_remaining,
			EXTRACT( EPOCH FROM (order_delivery_time::TIMESTAMPTZ - NOW()) ) AS delivery_time_remaining
		FROM orders
	) tm ON tm.order_id = o.order_id
	WHERE
	CASE 
		WHEN $1 = FALSE THEN o.order_deleted_at IS NULL
		WHEN $1 = TRUE THEN o.order_deleted_at IS NOT NULL
		ELSE TRUE
	END AND
	CASE
		WHEN $2 > 0 THEN o.order_id = $2
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($3::INT[], 1) > 0 THEN c.client_id = ANY($3::INT[])
		ELSE TRUE
	END
`

const ADD_ORDER = `
	WITH 
	address AS (
		INSERT INTO addresses (
			state_id, region_id, neighborhood_id, street_id, 
			area_id, address_home_number, address_target
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING address_id, region_id
	),
	new_order AS (
		INSERT INTO orders (
			client_id,
			order_special,
			order_summary,
			order_bring_time,
			branch_id,
			address_id
		) SELECT $8, $10, $11, $12, r.branch_id, a.address_id
		FROM address a
		LEFT JOIN regions r ON a.region_id = r.region_id
		RETURNING *,
		EXTRACT( EPOCH FROM (order_bring_time::TIMESTAMPTZ - NOW()) ) AS bring_time_remaining,
		to_char(order_bring_time, 'YYYY-MM-DD HH24:MI:SS') order_bring_time,
		to_char(order_created_at, 'YYYY-MM-DD HH24:MI:SS') order_created_at
	),
	new_order_status AS (
		INSERT INTO order_statuses (
			order_id,
			staff_id,
			order_status_code
		) SELECT no.order_id, $9::INT, 
			CASE
				WHEN $9 > 0 THEN 2
				ELSE 1
			END
		FROM new_order no
		WHERE no.order_id IS NOT NULL
		RETURNING *
	) SELECT * FROM new_order WHERE order_id IS NOT NULL
`

const CHANGE_ORDER = `
	WITH 
	address AS (
		UPDATE addresses a SET
			state_id = (
				CASE 
					WHEN $3 = FALSE THEN a.state_id
					WHEN $3 = TRUE AND $4 > 0 THEN $4
					ELSE NULL
				END
			), 
			region_id = (
				CASE 
					WHEN $3 = FALSE THEN a.region_id
					WHEN $3 = TRUE AND $5 > 0 THEN $5
					ELSE NULL
				END
			), 
			neighborhood_id = (
				CASE 
					WHEN $3 = FALSE THEN a.neighborhood_id
					WHEN $3 = TRUE AND $6 > 0 THEN $6
					ELSE NULL
				END
			), 
			street_id = (
				CASE 
					WHEN $3 = FALSE THEN a.street_id
					WHEN $3 = TRUE AND $7 > 0 THEN $7
					ELSE NULL
				END
			), 
			area_id = (
				CASE 
					WHEN $3 = FALSE THEN a.area_id
					WHEN $3 = TRUE AND $8 > 0 THEN $8
					ELSE NULL
				END
			), 
			address_home_number = (
				CASE 
					WHEN $3 = FALSE THEN a.address_home_number
					WHEN $3 = TRUE AND $9 > 0 THEN $9
					ELSE NULL
				END
			), 
			address_target = (
				CASE 
					WHEN $3 = FALSE THEN a.address_target
					WHEN $3 = TRUE AND LENGTH($10) > 0 THEN $10
					ELSE NULL
				END
			)
		FROM orders o
		WHERE o.order_deleted_at IS NULL AND
		o.address_id = a.address_id AND o.order_id = $1 AND
		CASE
			WHEN $2 > 0 THEN o.client_id = $2
			ELSE TRUE
		END
		RETURNING a.address_id, a.region_id
	) UPDATE orders o SET
		order_bring_time = (
			CASE
				WHEN LENGTH($11) > 0 THEN $11::TIMESTAMPTZ
				ELSE o.order_bring_time
			END
		),
		order_special = (
			CASE
				WHEN LENGTH($12) > 0 THEN CAST($12 AS BOOLEAN)
				ELSE o.order_special
			END
		),
		order_summary = (
			CASE
				WHEN LENGTH($13) > 0 THEN $13
				ELSE o.order_summary
			END
		),
		branch_id = r.branch_id
	FROM address a
	LEFT JOIN regions r ON r.region_id = a.region_id
	WHERE o.order_deleted_at IS NULL AND 
	o.address_id = a.address_id AND o.order_id = $1 AND
	CASE
		WHEN $2 > 0 THEN o.client_id = $2
		ELSE TRUE
	END
	RETURNING o.*,
	EXTRACT( EPOCH FROM (o.order_bring_time::TIMESTAMPTZ - NOW()) ) AS bring_time_remaining,
	to_char(o.order_bring_time, 'YYYY-MM-DD HH24:MI:SS') order_bring_time,
	to_char(o.order_created_at, 'YYYY-MM-DD HH24:MI:SS') order_created_at
`

const DELETE_ORDER = `
	WITH deleted_order AS (
		UPDATE orders SET
			order_deleted_at = current_timestamp
		WHERE order_deleted_at IS NULL AND order_id = $1 AND
		CASE
			WHEN $2 > 0 THEN client_id = $2
			ELSE TRUE
		END
		RETURNING *,
		to_char(order_bring_time, 'YYYY-MM-DD HH24:MI:SS') order_bring_time,
		to_char(order_brougth_time, 'YYYY-MM-DD HH24:MI:SS') order_brougth_time,
		to_char(order_delivery_time, 'YYYY-MM-DD HH24:MI:SS') order_delivery_time,
		to_char(order_delivered_time, 'YYYY-MM-DD HH24:MI:SS') order_delivered_time,
		to_char(order_created_at, 'YYYY-MM-DD HH24:MI:SS') order_created_at
	) UPDATE products p SET
		product_deleted_at = current_timestamp
	FROM deleted_order dor
	WHERE dor.order_id = p.order_id
	RETURNING dor.*
`

const RESTORE_ORDER = `
	WITH restored_order AS (
		UPDATE orders SET
			order_deleted_at = NULL
		WHERE order_deleted_at IS NOT NULL AND order_id = $1 AND
		CASE
			WHEN $2 > 0 THEN client_id = $2
			ELSE TRUE
		END
		RETURNING *,
		to_char(order_bring_time, 'YYYY-MM-DD HH24:MI:SS') order_bring_time,
		to_char(order_brougth_time, 'YYYY-MM-DD HH24:MI:SS') order_brougth_time,
		to_char(order_delivery_time, 'YYYY-MM-DD HH24:MI:SS') order_delivery_time,
		to_char(order_delivered_time, 'YYYY-MM-DD HH24:MI:SS') order_delivered_time,
		to_char(order_created_at, 'YYYY-MM-DD HH24:MI:SS') order_created_at
	) UPDATE products p SET
		product_deleted_at = NULL
	FROM restored_order dor
	WHERE dor.order_id = p.order_id
	RETURNING dor.*
`

const ORDER_STATUSES = `
	SELECT
		order_status_id,
		order_status_code AS status_code,
		staff_id,
		to_char(order_status_created_at, 'YYYY-MM-DD HH24:MI:SS') status_created_at
	FROM order_statuses os
	WHERE order_id = $1
	ORDER BY order_status_id ASC
`

const CHANGE_ORDER_STATUS = `
	WITH new_status AS (
		INSERT INTO order_statuses (
			order_id,
			order_status_code,
			staff_id
		) VALUES ($1, $2, $3)
		RETURNING *
	) SELECT 
		*,
		to_char(order_bring_time, 'YYYY-MM-DD HH24:MI:SS') order_bring_time,
		to_char(order_brougth_time, 'YYYY-MM-DD HH24:MI:SS') order_brougth_time,
		to_char(order_delivery_time, 'YYYY-MM-DD HH24:MI:SS') order_delivery_time,
		to_char(order_delivered_time, 'YYYY-MM-DD HH24:MI:SS') order_delivered_time,
		to_char(order_created_at, 'YYYY-MM-DD HH24:MI:SS') order_created_at
	FROM orders 
	WHERE order_id = $1
`


export default {
	CHANGE_ORDER_STATUS,
	ORDER_STATUSES,
	RESTORE_ORDER,
	DELETE_ORDER,
	CHANGE_ORDER,
	ADD_ORDER,
	ORDERS,
	ORDER
}

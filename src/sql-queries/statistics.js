const ORDERS_COUNT_STATISTICS = `
    SELECT
        COUNT(o.*) OVER() AS total_orders_count,
		SUM(COUNT(p.product_id)) OVER() AS total_products_count,
		SUM(o.order_special::INTEGER) OVER() total_special_orders_count,
		SUM((NOT o.order_special)::INTEGER) OVER() total_simple_orders_count
    FROM orders o
    NATURAL JOIN clients c
	INNER JOIN users u ON u.user_id = c.user_id
	LEFT JOIN addresses a ON a.address_id = o.address_id
	LEFT JOIN states sta ON sta.state_id = a.state_id
	LEFT JOIN regions r ON r.region_id = a.region_id
	LEFT JOIN neighborhoods n ON n.neighborhood_id = a.neighborhood_id
	LEFT JOIN streets st ON st.street_id = a.street_id
	LEFT JOIN areas ar ON ar.area_id = a.area_id
	LEFT JOIN products p ON p.order_id = o.order_id AND p.product_deleted_at IS NULL
    WHERE o.order_deleted_at IS NULL AND
	CASE
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN o.branch_id = ANY($1::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($2::TIMESTAMPTZ[], 1) = 2 THEN (
			o.order_created_at BETWEEN ($2::TIMESTAMPTZ[])[1] AND (($2::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($3::INT[], 1) > 0 THEN sta.state_id = ANY($3::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($4::INT[], 1) > 0 THEN r.region_id = ANY($4::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($5::INT[], 1) > 0 THEN n.neighborhood_id = ANY($5::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($6::INT[], 1) > 0 THEN st.street_id = ANY($6::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($7::INT[], 1) > 0 THEN ar.area_id = ANY($7::INT[]) 
		ELSE TRUE
	END
	GROUP BY o.order_id
`

const PRODUCTS_INFO_PER_SERVICE = `
	SELECT
		s.service_id,
		s.service_name,
		s.service_unit,
		b.branch_name,
		COUNT(p.*) AS service_products_count,
		JSON_AGG( p.product_size_details ) AS size_details
	FROM
	services s
	NATURAL JOIN branches b
	LEFT JOIN products p ON p.service_id = s.service_id AND p.product_deleted_at IS NULL
	LEFT JOIN orders o ON o.order_id = p.order_id AND o.order_deleted_at IS NULL
	LEFT JOIN addresses a ON a.address_id = o.address_id
	LEFT JOIN states sta ON sta.state_id = a.state_id
	LEFT JOIN regions r ON r.region_id = a.region_id
	LEFT JOIN neighborhoods n ON n.neighborhood_id = a.neighborhood_id
	LEFT JOIN streets st ON st.street_id = a.street_id
	LEFT JOIN areas ar ON ar.area_id = a.area_id
	WHERE s.service_deleted_at IS NULL AND
	CASE
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN o.branch_id = ANY($1::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($2::TIMESTAMPTZ[], 1) = 2 THEN (
			p.product_created_at BETWEEN ($2::TIMESTAMPTZ[])[1] AND (($2::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($3::INT[], 1) > 0 THEN sta.state_id = ANY($3::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($4::INT[], 1) > 0 THEN r.region_id = ANY($4::INT[])
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($5::INT[], 1) > 0 THEN n.neighborhood_id = ANY($5::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($6::INT[], 1) > 0 THEN st.street_id = ANY($6::INT[]) 
		ELSE TRUE
	END AND
	CASE 
		WHEN ARRAY_LENGTH($7::INT[], 1) > 0 THEN ar.area_id = ANY($7::INT[]) 
		ELSE TRUE
	END
	GROUP BY s.service_id, b.branch_name
`

const PRODUCTS_INFO_PER_STATUS = `
	SELECT
		COUNT(p.*) OVER() AS total_products_count,
		SUM( p.product_size ) OVER() AS total_product_size,
		SUM(
			CASE
				WHEN ps.product_status_code = 1 THEN 1
				ELSE 0
			END
		) OVER() AS products_count_1,
		ps.product_status_code
	FROM products p
	INNER JOIN orders o ON o.order_id = p.order_id AND o.order_deleted_at IS NULL
	INNER JOIN services s ON s.service_id = p.service_id AND s.service_deleted_at IS NULL
	LEFT JOIN LATERAL (
		SELECT * FROM product_statuses ps
		WHERE ps.product_id = p.product_id
		ORDER BY ps.product_status_id DESC
		LIMIT 1
	) ps ON ps.product_id = p.product_id
	WHERE p.product_deleted_at IS NULL AND
	CASE
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN o.branch_id = ANY($1::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN $2 > 0 THEN s.service_id = $2
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($3::TIMESTAMPTZ[], 1) = 2 THEN (
			p.product_created_at BETWEEN ($3::TIMESTAMPTZ[])[1] AND (($3::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END
	GROUP BY p.product_id, ps.product_status_code
`


export default {
	PRODUCTS_INFO_PER_SERVICE,
	PRODUCTS_INFO_PER_STATUS,
	ORDERS_COUNT_STATISTICS,
}
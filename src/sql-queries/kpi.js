const PRODUCTS_KPI = `
    SELECT
        p.product_id,
		p.product_size,
		p.product_size,
		p.product_size_details,
		s.service_unit,
		s.service_id,
		ps.product_status_code
	FROM products p
	INNER JOIN orders o ON o.order_id = p.order_id AND o.order_deleted_at IS NULL
	LEFT JOIN branches b ON b.branch_id = o.branch_id
	INNER JOIN services s ON s.service_id = p.service_id
	INNER JOIN LATERAL (
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
		WHEN $2 > 0 THEN ps.staff_id = $2
		ELSE TRUE
	END AND
    CASE
		WHEN $3 > 0 THEN ps.product_status_code = $3
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($4::TIMESTAMPTZ[], 1) = 2 THEN (
			p.product_created_at BETWEEN ($4::TIMESTAMPTZ[])[1] AND (($4::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END
`

export default {
    PRODUCTS_KPI
}
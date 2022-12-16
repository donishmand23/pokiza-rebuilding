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
	WHERE s.service_deleted_at IS NULL AND s.service_active = TRUE AND
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
		p.product_size,
		s.service_unit,
		s.service_name,
		b.branch_name,
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
		WHEN $2 > 0 THEN s.service_id = $2
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($3::TIMESTAMPTZ[], 1) = 2 THEN (
			p.product_created_at BETWEEN ($3::TIMESTAMPTZ[])[1] AND (($3::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END
	GROUP BY ps.product_status_code, p.product_id, s.service_unit, s.service_name, b.branch_name
`

const SERVICE_PRODUCTS_COUNT = `
	SELECT 
		s.service_id,
		ps.product_status_code,
		p.product_size,
		s.service_name,
		s.service_unit,
		b.branch_name
	FROM services s
	LEFT JOIN products p ON p.service_id = s.service_id AND p.product_deleted_at IS NULL
	INNER JOIN branches b ON b.branch_id = s.branch_id AND b.branch_deleted_at IS NULL
	INNER JOIN LATERAL (
		SELECT * FROM product_statuses ps
		WHERE ps.product_id = p.product_id
		ORDER BY ps.product_status_id DESC
		LIMIT 1
	) ps ON ps.product_id = p.product_id
	WHERE s.service_deleted_at IS NULL AND s.service_active = TRUE AND
	CASE
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN s.branch_id = ANY($1::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN $2 > 0 THEN ps.product_status_code = $2
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($3::TIMESTAMPTZ[], 1) = 2 THEN (
			s.service_created_at BETWEEN ($3::TIMESTAMPTZ[])[1] AND (($3::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END
	GROUP BY s.service_id, p.product_id, p.product_size, ps.product_status_code, b.branch_name
`

const BRANCH_DEBT_STATISTICS = `
	SELECT DISTINCT ON (s.staff_id)
        CASE
            WHEN transaction_type = 'income' THEN tu.branch_id
            WHEN transaction_type = 'outcome' THEN fu.branch_id
        END AS branch_id,
        CASE
            WHEN transaction_type = 'income' THEN dt.transaction_to
            WHEN transaction_type = 'outcome' THEN dt.transaction_from
        END AS staff_id,
        (
            SELECT COALESCE( SUM(transaction_money) ,0) FROM debt_transactions
            WHERE s.staff_id = transaction_to AND
            transaction_type = 'income' AND transaction_money_type = 'cash' AND
            transaction_status = 'accepted'
        ) AS debt_cash,
        (
            SELECT COALESCE( SUM(transaction_money) ,0) FROM debt_transactions
            WHERE s.staff_id = transaction_to AND
            transaction_type = 'income' AND transaction_money_type = 'card' AND
            transaction_status = 'accepted'
        ) AS debt_card,
        (
            SELECT COALESCE( SUM(transaction_money) ,0) FROM debt_transactions
            WHERE s.staff_id = transaction_from AND
            transaction_type = 'outcome' AND transaction_money_type = 'cash' AND
            transaction_status = 'accepted'
        ) AS equity_cash,
        (
            SELECT COALESCE( SUM(transaction_money) ,0) FROM debt_transactions
            WHERE s.staff_id = transaction_from AND
            transaction_type = 'outcome' AND transaction_money_type = 'card' AND
            transaction_status = 'accepted'
        ) AS equity_card
    FROM debt_transactions dt
    INNER JOIN staffs s ON s.staff_id = dt.transaction_from OR s.staff_id = dt.transaction_to
    LEFT JOIN staffs fs ON fs.staff_id = dt.transaction_from
    LEFT JOIN staffs ts ON ts.staff_id = dt.transaction_to
    LEFT JOIN users fu ON fu.user_id = fs.user_id
    LEFT JOIN users tu ON tu.user_id = ts.user_id
    WHERE dt.transaction_status = 'accepted' AND dt.transaction_deleted_at IS NULL AND
    CASE
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 AND dt.transaction_type = 'income' THEN tu.branch_id = ANY($1::INT[])
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 AND dt.transaction_type = 'outcome' THEN fu.branch_id = ANY($1::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($2::TIMESTAMPTZ[], 1) = 2 THEN (
			dt.transaction_created_at BETWEEN ($2::TIMESTAMPTZ[])[1] AND (($2::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END
`

const BRANCH_ORDER_SALE_STATISTICS = `
	SELECT
        ot.transaction_type,
		SUM(ot.transaction_money_cash) AS total_money_cash,
		SUM(ot.transaction_money_card) AS total_money_card,
		o.branch_id
    FROM order_transactions ot
	NATURAL JOIN orders o
	WHERE ot.transaction_deleted_at IS NULL AND
	CASE
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN o.branch_id = ANY($1::INT[])
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN o.branch_id = ANY($1::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($2::TIMESTAMPTZ[], 1) = 2 THEN (
			ot.transaction_created_at BETWEEN ($2::TIMESTAMPTZ[])[1] AND (($2::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END
	GROUP BY ot.transaction_type, o.branch_id
`

const BRANCH_EXPANSE_STATISTICS = `
	SELECT
		SUM(et.transaction_money),
        et.transaction_money_type,
		u.branch_id
    FROM expanse_transactions et
	LEFT JOIN staffs s ON s.staff_id = et.transaction_from
	INNER JOIN users u ON u.user_id = s.user_id
	WHERE et.transaction_deleted_at IS NULL AND et.transaction_status = 'accepted' AND
	CASE
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN u.branch_id = ANY($1::INT[])
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN u.branch_id = ANY($1::INT[])
		ELSE TRUE
	END AND
	CASE
		WHEN ARRAY_LENGTH($2::TIMESTAMPTZ[], 1) = 2 THEN (
			et.transaction_created_at BETWEEN ($2::TIMESTAMPTZ[])[1] AND (($2::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END
	GROUP BY et.transaction_money_type, u.branch_id
`

const SERVICE_SUMMARY_STATISTICS = `
	SELECT
		COUNT(*),
		to_char(p.product_created_at, 'YYYY-MM') date
	FROM products p
	NATURAL JOIN orders o
	LEFT JOIN addresses a ON a.address_id = o.address_id
	LEFT JOIN states sta ON sta.state_id = a.state_id
	LEFT JOIN regions r ON r.region_id = a.region_id
	LEFT JOIN neighborhoods n ON n.neighborhood_id = a.neighborhood_id
	LEFT JOIN streets st ON st.street_id = a.street_id
	LEFT JOIN areas ar ON ar.area_id = a.area_id
	WHERE p.service_id = $1 AND EXTRACT(YEAR FROM p.product_created_at) = $2 AND
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
	GROUP BY to_char(p.product_created_at, 'YYYY-MM')
`

export default {
	BRANCH_ORDER_SALE_STATISTICS,
	SERVICE_SUMMARY_STATISTICS,
	BRANCH_EXPANSE_STATISTICS,
	PRODUCTS_INFO_PER_SERVICE,
	PRODUCTS_INFO_PER_STATUS,
	ORDERS_COUNT_STATISTICS,
	BRANCH_DEBT_STATISTICS,
	SERVICE_PRODUCTS_COUNT,
}
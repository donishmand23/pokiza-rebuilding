const ORDERS_COUNT_STATISTICS = `
    SELECT
        COUNT(o.*) OVER() total_orders_count,
        o.order_special
    FROM orders o
    NATURAL JOIN clients c
	INNER JOIN users u ON u.user_id = c.user_id
	LEFT JOIN addresses a ON a.address_id = o.address_id
	LEFT JOIN states sta ON sta.state_id = a.state_id
	LEFT JOIN regions r ON r.region_id = a.region_id
	LEFT JOIN neighborhoods n ON n.neighborhood_id = a.neighborhood_id
	LEFT JOIN streets st ON st.street_id = a.street_id
	LEFT JOIN areas ar ON ar.area_id = a.area_id
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
`

export default {
    ORDERS_COUNT_STATISTICS
}
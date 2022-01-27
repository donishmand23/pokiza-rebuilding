const TRANSPORTS = `
	SELECT
		t.transport_id,
		t.transport_model,
		t.transport_color,
		t.transport_number,
		t.transport_summary,
		t.branch_id,
		t.transport_broken,
		count(*) OVER() as full_count,
		to_char(t.transport_created_at, 'YYYY-MM-DD HH24:MI:SS') transport_created_at
	FROM transports t
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
	END
	ORDER BY
	(CASE WHEN $8 = 1 AND $9 = 2 THEN t.transport_id END) ASC,
	(CASE WHEN $8 = 1 AND $9 = 1 THEN t.transport_id END) DESC
	OFFSET $1 ROWS FETCH FIRST $2 ROW ONLY
`


export default {
	TRANSPORTS
}
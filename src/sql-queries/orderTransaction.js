const TRANSACTIONS = `
    SELECT
        ot.transaction_id,
        ot.transaction_money_cash,
        ot.transaction_money_card,
        ot.transaction_money_card + ot.transaction_money_cash as transaction_money_total,
        ot.order_id,
        ot.staff_id,
        ot.transaction_type,
        ot.transaction_summary,
        ot.transaction_deleted_at,
        to_char(ot.transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
    FROM order_transactions ot
    LEFT JOIN staffs s ON s.staff_id = ot.staff_id
    LEFT JOIN users u ON u.user_id = s.user_id
    WHERE
    CASE
		WHEN $1 > 0 THEN ot.transaction_id = $1
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($2::INT[], 1) > 0 THEN ot.staff_id = ANY($2::INT[])
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($3::INT[], 1) > 0 THEN u.branch_id = ANY($3::INT[])
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($4::INT[], 1) > 0 THEN ot.order_id = ANY($4::INT[])
		ELSE TRUE
	END AND
    CASE
		WHEN LENGTH($5) > 0 THEN ot.transaction_type = $5
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($6::TIMESTAMPTZ[], 1) = 2 THEN (
			ot.transaction_created_at BETWEEN ($6::TIMESTAMPTZ[])[1] AND (($6::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END
    ORDER BY ot.transaction_id DESC
`

const MAKE_TRANSACTION = `
    INSERT INTO order_transactions (
        order_id,
        staff_id,
        transaction_money_cash,
        transaction_money_card,
        transaction_type,
        transaction_summary
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const DELETE_TRANSACTION = `
    UPDATE order_transactions SET
        transaction_deleted_at = current_timestamp
    WHERE transaction_deleted_at IS NULL AND
    transaction_id = $1 and staff_id = $2
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const UPDATE_TRANSACTION = `
    UPDATE order_transactions SET
        transaction_summary = $3
    WHERE transaction_deleted_at IS NULL AND
    transaction_id = $1 and staff_id = $2
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

export default {
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
    MAKE_TRANSACTION,
    TRANSACTIONS
}
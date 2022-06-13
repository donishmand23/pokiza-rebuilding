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
	END AND
    CASE
		WHEN $7 > 0 AND ot.transaction_money_cash + ot.transaction_money_card > 0 THEN ot.transaction_money_cash + ot.transaction_money_card <= $7
		ELSE TRUE
	END AND
    CASE   
        WHEN $8 = TRUE AND u.branch_id = ANY($9::INT[]) THEN ot.staff_id = $10
        ELSE TRUE
    END
    ORDER BY ot.transaction_id DESC
`

const TRANSACTION = `
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
    WHERE ot.transaction_deleted_at IS NULL AND
    CASE
		WHEN $1 > 0 THEN ot.transaction_id = $1
		ELSE TRUE
	END AND
    CASE
		WHEN $2 > 0 THEN ot.staff_id = $2
		ELSE TRUE
	END AND
    CASE
		WHEN $3 > 0 THEN u.branch_id = $3
		ELSE TRUE
	END AND
    CASE
		WHEN $4 > 0 THEN ot.order_id = $4
		ELSE TRUE
	END AND
    CASE
		WHEN LENGTH($5) > 0 THEN ot.transaction_type = $5
		ELSE TRUE
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
    transaction_id = $1
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const UPDATE_TRANSACTION = `
    UPDATE order_transactions ot SET
        transaction_money_cash = (
            CASE   
                WHEN $2 > 0 OR $3 > 0 THEN $2
                ELSE ot.transaction_money_cash
            END
        ),
        transaction_money_card = (
            CASE   
                WHEN $2 > 0 OR $3 > 0 THEN $3
                ELSE ot.transaction_money_card
            END
        ),
        transaction_summary = (
            CASE   
                WHEN LENGTH($4) > 0 THEN $4
                ELSE ot.transaction_summary
            END
        )
    WHERE ot.transaction_deleted_at IS NULL AND
    ot.transaction_id = $1
    RETURNING ot.*,
    to_char(ot.transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

export default {
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
    MAKE_TRANSACTION,
    TRANSACTIONS,
    TRANSACTION
}
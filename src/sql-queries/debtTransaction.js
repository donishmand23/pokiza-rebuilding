const TRANSACTIONS = `
    SELECT
        dt.transaction_id,
        dt.transaction_money,
        dt.transaction_money_type,
        dt.transaction_from,
        dt.transaction_to,
        dt.transaction_status,
        dt.transaction_summary,
        dt.transaction_deleted_at,
        CASE
            WHEN dt.transaction_from = $14 THEN 'outcome'
            WHEN dt.transaction_to = $14 THEN 'income'
            ELSE dt.transaction_type
        END AS transaction_type,
        CASE    
            WHEN $9 = 'income' THEN fu.branch_id
            WHEN $9 = 'outcome' THEN tu.branch_id
        END AS branch_id,
        to_char(dt.transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
    FROM debt_transactions dt
    LEFT JOIN staffs fs ON fs.staff_id = dt.transaction_from
    LEFT JOIN staffs ts ON ts.staff_id = dt.transaction_to
    LEFT JOIN users fu ON fu.user_id = fs.user_id
    LEFT JOIN users tu ON tu.user_id = ts.user_id
    WHERE
    CASE
		WHEN $3 > 0 THEN dt.transaction_id = $3
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($4::INT[], 1) > 0 AND $9 = 'income' THEN fu.branch_id = ANY($4::INT[])
		WHEN ARRAY_LENGTH($4::INT[], 1) > 0 AND $9 = 'outcome' THEN tu.branch_id = ANY($4::INT[])
		ELSE TRUE
	END AND
    CASE
		WHEN $5 > 0 THEN dt.transaction_to = $5
		ELSE TRUE
	END AND
    CASE
		WHEN $6 > 0 THEN dt.transaction_from = $6
		ELSE TRUE
	END AND
    CASE
		WHEN LENGTH($7) > 0 THEN dt.transaction_money_type = $7
		ELSE TRUE
	END AND
    CASE
		WHEN $8 > 0 THEN dt.transaction_money <= $6
		ELSE TRUE
	END AND
    CASE    
        WHEN $9 = 'income' AND dt.transaction_to = $14 THEN dt.transaction_to = $14
        WHEN $9 = 'income' AND dt.transaction_from = $14 THEN dt.transaction_type = 'outcome'
        WHEN $9 = 'outcome' AND dt.transaction_from = $14 THEN dt.transaction_from = $14
        WHEN $9 = 'outcome' AND dt.transaction_to = $14 THEN dt.transaction_type = 'income'
        WHEN LENGTH($9) > 0 THEN dt.transaction_type = $9
        ELSE TRUE
    END AND
    CASE
		WHEN ARRAY_LENGTH($10::TIMESTAMPTZ[], 1) = 2 THEN (
			dt.transaction_created_at BETWEEN ($10::TIMESTAMPTZ[])[1] AND (($10::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
    CASE
		WHEN LENGTH($11) > 0 THEN dt.transaction_status = $11
		ELSE TRUE
	END AND
    CASE   
        WHEN $9 = 'income' AND $12 = TRUE AND tu.branch_id = ANY($13::INT[]) THEN dt.transaction_to = $14
        WHEN $9 = 'outcome' AND $12 = TRUE AND fu.branch_id = ANY($13::INT[]) THEN dt.transaction_from = $14
        ELSE TRUE
    END
    ORDER BY dt.transaction_id DESC
    OFFSET $1 ROWS FETCH FIRST $2 ROW ONLY
`

const TRANSACTION = `
    SELECT
        dt.transaction_id,
        dt.transaction_money,
        dt.transaction_money_type,
        dt.transaction_from,
        dt.transaction_to,
        dt.transaction_status,
        dt.transaction_summary,
        dt.transaction_type,
        dt.transaction_deleted_at,
        to_char(dt.transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
    FROM debt_transactions dt
    WHERE
    CASE
		WHEN $1 > 0 THEN dt.transaction_id = $1
		ELSE TRUE
	END AND
    CASE
		WHEN $2 > 0 THEN dt.transaction_to = $2
		ELSE TRUE
	END AND
    CASE
		WHEN $3 > 0 THEN dt.transaction_from = $3
		ELSE TRUE
	END
    ORDER BY dt.transaction_id DESC
`

const MAKE_TRANSACTION = `
    INSERT INTO debt_transactions (
        transaction_money,
        transaction_money_type,
        transaction_from,
        transaction_to,
        transaction_status,
        transaction_summary,
        transaction_type,
        transaction_created_at
    ) SELECT $1, $2, $3, $4, $5, $6, $7,
    CASE
        WHEN LENGTH($8) > 0 THEN $8::timestamptz
        ELSE current_timestamp
    END AS transaction_created_at
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const CANCEL_TRANSACTION = `
    UPDATE debt_transactions SET
        transaction_status = 'cancelled'
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const ACCEPT_TRANSACTION = `
    UPDATE debt_transactions SET
        transaction_status = 'accepted'
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const DELETE_TRANSACTION = `
    UPDATE debt_transactions SET
        transaction_status = 'deleted'
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const UPDATE_TRANSACTION = `
    UPDATE debt_transactions db SET
        transaction_to = (
            CASE
                WHEN $2 > 0 THEN $2
                ELSE db.transaction_to
            END
        ),
        transaction_from = (
            CASE
                WHEN $3 > 0 THEN $3
                ELSE db.transaction_from
            END
        ),
        transaction_money = (
            CASE
                WHEN $4 > 0 THEN $4
                ELSE db.transaction_money
            END
        ),
        transaction_money_type = (
            CASE
                WHEN LENGTH($5) > 0 THEN $5
                ELSE db.transaction_money_type
            END
        ),
        transaction_summary = (
            CASE
                WHEN LENGTH($6) > 0 THEN $6
                ELSE db.transaction_summary
            END
        ),
        transaction_created_at = (
            CASE
                WHEN LENGTH($7) > 0 THEN $7::timestamptz
                ELSE db.transaction_created_at
            END
        )
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`


export default {
    DELETE_TRANSACTION,
    UPDATE_TRANSACTION,
    ACCEPT_TRANSACTION,
    CANCEL_TRANSACTION,
    MAKE_TRANSACTION,
    TRANSACTIONS,
    TRANSACTION,
}
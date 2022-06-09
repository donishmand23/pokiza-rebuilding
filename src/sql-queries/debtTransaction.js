const TRANSACTIONS = `
    SELECT
        dt.transaction_id,
        dt.transaction_money_cash,
        dt.transaction_money_card,
        dt.transaction_money_card + dt.transaction_money_cash as transaction_money_total,
        dt.transaction_from,
        dt.transaction_to,
        dt.transaction_status,
        dt.transaction_summary,
        dt.transaction_deleted_at,
        CASE
            WHEN dt.transaction_from = $9 THEN 'outcome'
            WHEN dt.transaction_to = $9 THEN 'income'
        END AS transaction_type,
        CASE    
            WHEN $7 = 'income' THEN fu.branch_id
            WHEN $7 = 'outcome' THEN tu.branch_id
        END AS branch_id,
        to_char(dt.transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
    FROM debt_transactions dt
    LEFT JOIN staffs fs ON fs.staff_id = dt.transaction_from
    LEFT JOIN staffs ts ON ts.staff_id = dt.transaction_to
    LEFT JOIN users fu ON fu.user_id = fs.user_id
    LEFT JOIN users tu ON tu.user_id = ts.user_id
    WHERE
    CASE
		WHEN $1 > 0 THEN dt.transaction_id = $1
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($2::INT[], 1) > 0 AND $7 = 'income' THEN fu.branch_id = ANY($2::INT[])
		WHEN ARRAY_LENGTH($2::INT[], 1) > 0 AND $7 = 'outcome' THEN tu.branch_id = ANY($2::INT[])
		ELSE TRUE
	END AND
    CASE
		WHEN $3 > 0 THEN dt.transaction_to = $3
		ELSE TRUE
	END AND
    CASE
		WHEN $4 > 0 THEN dt.transaction_from = $4
		ELSE TRUE
	END AND
    CASE
		WHEN $5 = 'cash' THEN dt.transaction_money_cash > 0
		WHEN $5 = 'card' THEN dt.transaction_money_card > 0
		ELSE TRUE
	END AND
    CASE
		WHEN $6 > 0 AND dt.transaction_money_cash > 0 THEN dt.transaction_money_cash <= $6
		WHEN $6 > 0 AND dt.transaction_money_card > 0 THEN dt.transaction_money_card <= $6
		ELSE TRUE
	END AND
    CASE    
        WHEN $7 = 'income' THEN dt.transaction_to = $9
        WHEN $7 = 'outcome' THEN dt.transaction_from = $9
        ELSE TRUE
    END AND
    CASE
		WHEN ARRAY_LENGTH($8::TIMESTAMPTZ[], 1) = 2 THEN (
			dt.transaction_created_at BETWEEN ($8::TIMESTAMPTZ[])[1] AND (($8::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
    CASE
		WHEN LENGTH($10) > 0 THEN dt.transaction_status = $10
		ELSE TRUE
	END
    ORDER BY dt.transaction_id DESC
`

const MAKE_TRANSACTION = `
    INSERT INTO debt_transactions (
        transaction_money_cash,
        transaction_money_card,
        transaction_from,
        transaction_to,
        transaction_status,
        transaction_summary,
        transaction_created_at
    ) SELECT $1, $2, $3, $4, $5, $6,
    CASE
        WHEN LENGTH($7) > 0 THEN $7::timestamptz
        ELSE current_timestamp
    END AS transaction_created_at
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`


export default {
    MAKE_TRANSACTION,
    TRANSACTIONS,
}
const TRANSACTIONS = `
    SELECT
        ft.transaction_id,
        ft.transaction_money,
        ft.transaction_money_type,
        ft.transaction_from,
        ft.transaction_to,
        ft.transaction_status,
        ft.transaction_summary,
        fu.branch_id branch_from,
        tu.branch_id branch_to,
        ft.transaction_fond_deleted_at,
        CASE
            WHEN ft.transaction_from = $14 THEN 'outcome'
            WHEN ft.transaction_to = $14 THEN 'income'
            ELSE $9
        END AS transaction_type,
        to_char(ft.transaction_fond_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_fond_created_at
    FROM fond_transactions ft
    LEFT JOIN staffs fs ON fs.staff_id = ft.transaction_from
    LEFT JOIN staffs ts ON ts.staff_id = ft.transaction_to
    INNER JOIN users fu ON fu.user_id = fs.user_id
    INNER JOIN users tu ON tu.user_id = ts.user_id
    WHERE
    CASE
		WHEN $3 > 0 THEN ft.transaction_id = $3
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($4::INT[], 1) > 0 AND $9 = 'income' THEN tu.branch_id = ANY($4::INT[])
		WHEN ARRAY_LENGTH($4::INT[], 1) > 0 AND $9 = 'outcome' THEN fu.branch_id = ANY($4::INT[])
		ELSE TRUE
	END AND
    CASE
		WHEN $5 > 0 THEN ft.transaction_to = $5
		ELSE TRUE
	END AND
    CASE
		WHEN $6 > 0 THEN ft.transaction_from = $6
		ELSE TRUE
	END AND
    CASE
		WHEN LENGTH($7) > 0 THEN ft.transaction_money_type = $7 
		ELSE TRUE
	END AND
    CASE
		WHEN $8 > 0 THEN ft.transaction_money <= $6
		ELSE TRUE
	END AND
    CASE    
        WHEN $9 = 'income' AND (ft.transaction_to = $14 OR ft.transaction_from = $14) THEN ft.transaction_to = $14
        WHEN $9 = 'outcome' AND (ft.transaction_from = $14 OR ft.transaction_to = $14) THEN ft.transaction_from = $14
        ELSE TRUE
    END AND
    CASE
		WHEN ARRAY_LENGTH($10::TIMESTAMPTZ[], 1) = 2 THEN (
			ft.transaction_fond_created_at BETWEEN ($10::TIMESTAMPTZ[])[1] AND (($10::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
    CASE
		WHEN LENGTH($11) > 0 THEN ft.transaction_status = $11
		ELSE TRUE
	END AND
    CASE   
        WHEN $9 = 'income' AND $12 = TRUE AND tu.branch_id = ANY($13::INT[]) THEN ft.transaction_to = $14
        WHEN $9 = 'outcome' AND $12 = TRUE AND fu.branch_id = ANY($13::INT[]) THEN ft.transaction_from = $14
        ELSE TRUE
    END
    ORDER BY ft.transaction_id DESC
    OFFSET $1 ROWS FETCH FIRST $2 ROW ONLY
`

const TRANSACTION = `
    SELECT
        ft.transaction_id,
        ft.transaction_money,
        ft.transaction_money_type,
        ft.transaction_from,
        ft.transaction_to,
        ft.transaction_status,
        ft.transaction_summary,
        ft.transaction_fond_deleted_at,
        to_char(ft.transaction_fond_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_fond_created_at
    FROM fond_transactions ft
    WHERE
    CASE
		WHEN $1 > 0 THEN ft.transaction_id = $1
		ELSE TRUE
	END AND
    CASE
		WHEN $2 > 0 THEN ft.transaction_to = $2
		ELSE TRUE
	END AND
    CASE
		WHEN $3 > 0 THEN ft.transaction_from = $3
		ELSE TRUE
	END
    ORDER BY ft.transaction_id DESC
`

const MAKE_TRANSACTION = `
    INSERT INTO fond_transactions (
        transaction_money,
        transaction_money_type,
        transaction_from,
        transaction_to,
        transaction_status,
        transaction_summary,
        transaction_fond_created_at
    ) SELECT $1, $2, $3, $4, $5, $6,
    CASE
        WHEN LENGTH($7) > 0 THEN $7::timestamptz
        ELSE current_timestamp
    END AS transaction_fond_created_at
    RETURNING *,
    to_char(transaction_fond_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_fond_created_at
`

const ACCEPT_TRANSACTION = `
    UPDATE fond_transactions SET
        transaction_status = 'accepted'
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_fond_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_fond_created_at
`

const CANCEL_TRANSACTION = `
    UPDATE fond_transactions SET
        transaction_status = 'cancelled'
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_fond_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_fond_created_at
`

const DELETE_TRANSACTION = `
    UPDATE fond_transactions SET
        transaction_status = 'deleted'
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_fond_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_fond_created_at
`

const UPDATE_TRANSACTION = `
    UPDATE fond_transactions ft SET
        transaction_to = (
            CASE
                WHEN $2 > 0 THEN $2
                ELSE ft.transaction_to
            END
        ),
        transaction_from = (
            CASE
                WHEN $3 > 0 THEN $3
                ELSE ft.transaction_from
            END
        ),
        transaction_money = (
            CASE
                WHEN $4 > 0 THEN $4
                ELSE ft.transaction_money
            END
        ),
        transaction_money_type = (
            CASE
                WHEN LENGTH($5) > 0 THEN $5
                ELSE ft.transaction_money_type
            END
        ),
        transaction_summary = (
            CASE
                WHEN LENGTH($6) > 0 THEN $6
                ELSE ft.transaction_summary
            END
        ),
        transaction_fond_created_at = (
            CASE
                WHEN LENGTH($7) > 0 THEN $7::timestamptz
                ELSE ft.transaction_fond_created_at
            END
        )
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_fond_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_fond_created_at
`

const TRANSACTION_BRANCH = `
    SELECT
        u.branch_id
    FROM fond_transactions ft
    INNER JOIN staffs s ON s.staff_id = ft.transaction_from
    INNER JOIN users u ON u.user_id = s.user_id
    WHERE ft.transaction_id = $1
`

export default {
    TRANSACTION_BRANCH,
    DELETE_TRANSACTION,
    UPDATE_TRANSACTION,
    CANCEL_TRANSACTION,
    ACCEPT_TRANSACTION,
    MAKE_TRANSACTION,
    TRANSACTIONS,
    TRANSACTION
}
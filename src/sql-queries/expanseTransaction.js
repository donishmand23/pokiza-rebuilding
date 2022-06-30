const TRANSACTIONS = `
    SELECT
        et.transaction_id,
        et.transaction_money,
        et.transaction_money_type,
        et.transaction_from,
        et.transaction_to,
        et.transaction_status,
        et.transaction_summary,
        et.transaction_deleted_at,
        CASE
            WHEN et.transaction_from = $15 THEN 'outcome'
            WHEN et.transaction_to = $15 THEN 'income'
            ELSE $9
        END AS transaction_type,
        CASE    
            WHEN $9 = 'income' THEN fu.branch_id
            WHEN $9 = 'outcome' THEN tu.branch_id
        END AS branch_id,
        to_char(et.transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
    FROM expanse_transactions et
    LEFT JOIN staffs fs ON fs.staff_id = et.transaction_from
    LEFT JOIN staffs ts ON ts.staff_id = et.transaction_to
    LEFT JOIN users fu ON fu.user_id = fs.user_id
    LEFT JOIN users tu ON tu.user_id = ts.user_id
    WHERE
    CASE
		WHEN $3 > 0 THEN et.transaction_id = $3
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($4::INT[], 1) > 0 AND $9 = 'income' THEN tu.branch_id = ANY($4::INT[])
		WHEN ARRAY_LENGTH($4::INT[], 1) > 0 AND $9 = 'outcome' THEN fu.branch_id = ANY($4::INT[])
		ELSE TRUE
	END AND
    CASE
		WHEN $5 > 0 THEN et.transaction_to = $5
		ELSE TRUE
	END AND
    CASE
		WHEN $6 > 0 THEN et.transaction_from = $6
		ELSE TRUE
	END AND
    CASE
		WHEN LENGTH($7) > 0 THEN et.transaction_money_type = $7 
		ELSE TRUE
	END AND
    CASE
		WHEN $8 > 0 THEN et.transaction_money <= $6
		ELSE TRUE
	END AND
    CASE    
        WHEN $9 = 'income' AND (et.transaction_to = $15 OR et.transaction_from = $15) THEN et.transaction_to = $15
        WHEN $9 = 'outcome' AND (et.transaction_from = $15 OR et.transaction_to = $15) THEN et.transaction_from = $15
        ELSE TRUE
    END AND
    CASE
		WHEN ARRAY_LENGTH($10::TIMESTAMPTZ[], 1) = 2 THEN (
			et.transaction_created_at BETWEEN ($10::TIMESTAMPTZ[])[1] AND (($10::TIMESTAMPTZ[])[2] + '1 day'::INTERVAL)
		) ELSE TRUE
	END AND
    CASE
		WHEN LENGTH($11) > 0 THEN et.transaction_status = $11
		ELSE TRUE
	END AND
    CASE
		WHEN $12 > 0 THEN et.expanse_id = $12
		ELSE TRUE
	END AND
    CASE   
        WHEN $9 = 'income' AND $13 = TRUE AND tu.branch_id = ANY($14::INT[]) THEN et.transaction_to = $15
        WHEN $9 = 'outcome' AND $13 = TRUE AND fu.branch_id = ANY($14::INT[]) THEN et.transaction_from = $15
        ELSE TRUE
    END
    ORDER BY et.transaction_id DESC
    OFFSET $1 ROWS FETCH FIRST $2 ROW ONLY
`

const TRANSACTION = `
    SELECT
        et.transaction_id,
        et.transaction_money,
        et.transaction_money_type,
        et.transaction_from,
        et.transaction_to,
        et.expanse_id,
        et.transaction_status,
        et.transaction_summary,
        et.transaction_deleted_at,
        to_char(et.transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
    FROM expanse_transactions et
    WHERE
    CASE
		WHEN $1 > 0 THEN et.transaction_id = $1
		ELSE TRUE
	END AND
    CASE
		WHEN $2 > 0 THEN et.transaction_to = $2
		ELSE TRUE
	END AND
    CASE
		WHEN $3 > 0 THEN et.transaction_from = $3
		ELSE TRUE
	END
    ORDER BY et.transaction_id DESC
`

const MAKE_TRANSACTION = `
    INSERT INTO expanse_transactions (
        transaction_money,
        transaction_money_type,
        transaction_from,
        transaction_to,
        transaction_status,
        transaction_summary,
        expanse_id,
        transaction_created_at
    ) SELECT $1, $2, $3, $4, $5, $6, $7,
    CASE
        WHEN LENGTH($8) > 0 THEN $8::timestamptz
        ELSE current_timestamp
    END AS transaction_created_at
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const ACCEPT_TRANSACTION = `
    UPDATE expanse_transactions SET
        transaction_status = 'accepted'
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const CANCEL_TRANSACTION = `
    UPDATE expanse_transactions SET
        transaction_status = 'cancelled'
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const DELETE_TRANSACTION = `
    UPDATE expanse_transactions SET
        transaction_status = 'deleted'
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const UPDATE_TRANSACTION = `
    UPDATE expanse_transactions et SET
        transaction_to = (
            CASE
                WHEN $2 > 0 THEN $2
                ELSE et.transaction_to
            END
        ),
        transaction_from = (
            CASE
                WHEN $3 > 0 THEN $3
                ELSE et.transaction_from
            END
        ),
        transaction_money = (
            CASE
                WHEN $4 > 0 THEN $4
                ELSE et.transaction_money
            END
        ),
        transaction_money_type = (
            CASE
                WHEN LENGTH($5) > 0 THEN $5
                ELSE et.transaction_money_type
            END
        ),
        transaction_summary = (
            CASE
                WHEN LENGTH($6) > 0 THEN $6
                ELSE et.transaction_summary
            END
        ),
        transaction_created_at = (
            CASE
                WHEN LENGTH($7) > 0 THEN $7::timestamptz
                ELSE et.transaction_created_at
            END
        ),
        expanse_id = (
            CASE
                WHEN $8 > 0 THEN $8
                ELSE et.expanse_id
            END
        )
    WHERE transaction_id = $1
    RETURNING *,
    to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS') transaction_created_at
`

const EXPANSES = `
    SELECT 
        expanse_id,
        expanse_name,
        to_char(expanse_created_at, 'YYYY-MM-DD HH24:MI:SS') expanse_created_at
    FROM expanses
    WHERE
    CASE
		WHEN $1 > 0 THEN expanse_id = $1
		ELSE TRUE
	END
`

const ADD_EXPANSE = `
    INSERT INTO expanses (
        expanse_name
    ) VALUES ($1)
    RETURNING *,
    to_char(expanse_created_at, 'YYYY-MM-DD HH24:MI:SS') expanse_created_at
`

const DELETE_EXPANSE = `
    DELETE FROM expanses
    WHERE expanse_id = $1
    RETURNING *,
    to_char(expanse_created_at, 'YYYY-MM-DD HH24:MI:SS') expanse_created_at
`

const TRANSACTION_BRANCH = `
    SELECT
        u.branch_id
    FROM expanse_transactions et
    INNER JOIN staffs s ON s.staff_id = et.transaction_from
    INNER JOIN users u ON u.user_id = s.user_id
    WHERE et.transaction_id = $1
`

export default {
    TRANSACTION_BRANCH,
    ACCEPT_TRANSACTION,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
    CANCEL_TRANSACTION,
    MAKE_TRANSACTION,
    DELETE_EXPANSE,
    TRANSACTIONS,
    TRANSACTION,
    ADD_EXPANSE,
    EXPANSES,
}
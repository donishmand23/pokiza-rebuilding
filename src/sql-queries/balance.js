const BALANCES = `
    SELECT
        b.balance_id,
        b.balance_money_cash,
        b.balance_money_card,
        b.balance_money_cash + b.balance_money_card AS balance_money_total,
        b.staff_id,
        u.branch_id,
        to_char(balance_created_at, 'YYYY-MM-DD HH24:MI:SS') balance_created_at
    FROM balances b
    LEFT JOIN staffs s ON s.staff_id = b.staff_id
    LEFT JOIN users u ON u.user_id = s.user_id
    WHERE b.balance_deleted_at IS NULL AND
    CASE
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN b.staff_id = ANY($1::INT[])
		ELSE TRUE
	END AND
    CASE
		WHEN ARRAY_LENGTH($2::INT[], 1) > 0 THEN u.branch_id = ANY($2::INT[])
		ELSE TRUE
	END AND
    CASE   
        WHEN $3 = TRUE AND u.branch_id = ANY($4::INT[]) THEN b.staff_id = $5
        ELSE TRUE
    END
`

const BALANCE = `
    SELECT
        b.balance_id,
        b.balance_money_cash,
        b.balance_money_card,
        b.balance_money_cash + b.balance_money_card AS balance_money_total,
        b.staff_id,
        u.branch_id,
        to_char(balance_created_at, 'YYYY-MM-DD HH24:MI:SS') balance_created_at
    FROM balances b
    LEFT JOIN staffs s ON s.staff_id = b.staff_id
    LEFT JOIN users u ON u.user_id = s.user_id
    WHERE b.balance_deleted_at IS NULL AND
    CASE
		WHEN $1 > 0 THEN b.staff_id = $1
		ELSE TRUE
	END AND
    CASE
		WHEN $2 > 0 THEN u.branch_id = $2
		ELSE TRUE
	END
`

const MAIN_BALANCES = `
    SELECT
        COALESCE( SUM(bb.balance_money_card) ,0) balance_money_card,
        COALESCE( SUM(bb.balance_money_cash) ,0) balance_money_cash,
        COALESCE( SUM(bb.balance_money_total) ,0) balance_money_total,
        b.branch_id
    FROM branches b
    LEFT JOIN (
		SELECT
            b.balance_money_cash,
            b.balance_money_card,
            b.balance_money_cash + b.balance_money_card AS balance_money_total,
            u.branch_id,
            to_char(balance_created_at, 'YYYY-MM-DD HH24:MI:SS') balance_created_at
        FROM balances b
        LEFT JOIN staffs s ON s.staff_id = b.staff_id
        LEFT JOIN users u ON u.user_id = s.user_id
	) bb ON bb.branch_id = b.branch_id
    WHERE b.branch_deleted_at IS NULL AND
    CASE
		WHEN ARRAY_LENGTH($1::INT[], 1) > 0 THEN b.branch_id = ANY($1::INT[])
		ELSE TRUE
	END 
    GROUP BY b.branch_id
`

const INCREMENT_BALANCE = `
    UPDATE balances b SET
        balance_money_cash = (
            CASE
                WHEN $2 > 0 THEN b.balance_money_cash + $2
                ELSE b.balance_money_cash
            END
        ),
        balance_money_card = (
            CASE
                WHEN $3 > 0 THEN b.balance_money_card + $3
                ELSE b.balance_money_card
            END
        )
    WHERE b.staff_id = $1
    RETURNING *
`

const DECREMENT_BALANCE = `
    UPDATE balances b SET
        balance_money_cash = (
            CASE
                WHEN $2 > 0 THEN b.balance_money_cash - $2
                ELSE b.balance_money_cash
            END
        ),
        balance_money_card = (
            CASE
                WHEN $3 > 0 THEN b.balance_money_card - $3
                ELSE b.balance_money_card
            END
        )
    WHERE b.staff_id = $1
    RETURNING *
`

const CREATE_BALANCE = `
    INSERT INTO balances (
        staff_id
    ) VALUES ($1)
    RETURNING *
`

export default {
    INCREMENT_BALANCE,
    DECREMENT_BALANCE,
    CREATE_BALANCE,
    MAIN_BALANCES,
    BALANCES,
    BALANCE
}
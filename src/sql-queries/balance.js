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
    UPDATE balances SET
        balance_money_cash = balance_money_cash + $2,
        balance_money_card = balance_money_card + $3
    WHERE staff_id = $1
    RETURNING *
`

const DECREMENT_BALANCE = `
    UPDATE balances SET
        balance_money_cash = balance_money_cash - $2,
        balance_money_card = balance_money_card - $3
    WHERE staff_id = $1
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
    BALANCES
}
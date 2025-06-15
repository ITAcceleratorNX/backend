ALTER TABLE transactions
    ALTER COLUMN payment_id DROP NOT NULL,
    ALTER COLUMN operation_id DROP NOT NULL,
    ALTER COLUMN payment_type DROP NOT NULL,
    ALTER COLUMN operation_type DROP NOT NULL,
    ALTER COLUMN operation_status DROP NOT NULL,
    ALTER COLUMN amount DROP NOT NULL,
    ALTER COLUMN created_date DROP NOT NULL,
    ALTER COLUMN payment_date DROP NOT NULL;


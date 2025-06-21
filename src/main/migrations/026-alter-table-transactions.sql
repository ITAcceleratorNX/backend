CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE transactions
ALTER COLUMN created_date TYPE TIMESTAMP
USING created_date::timestamp;

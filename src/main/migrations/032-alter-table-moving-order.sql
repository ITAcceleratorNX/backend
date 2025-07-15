ALTER TABLE moving_orders
    ADD COLUMN address TEXT;

ALTER TYPE availability_status
    ADD VALUE IF NOT EXISTS 'AWAITABLE';
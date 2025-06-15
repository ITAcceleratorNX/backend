ALTER TABLE order_payments
    ADD COLUMN penalty_amount NUMERIC(10, 2) DEFAULT 0;

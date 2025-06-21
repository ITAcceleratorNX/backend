ALTER TABLE orders
    DROP COLUMN IF EXISTS box_amount,
    DROP COLUMN IF EXISTS cargo_mark,
    DROP COLUMN IF EXISTS product_names;

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    volume NUMERIC(10, 2) NOT NULL,
    cargo_mark VARCHAR(20) CHECK (cargo_mark IN ('NO', 'HEAVY', 'FRAGILE'))
);

ALTER TABLE order_payments
    DROP CONSTRAINT IF EXISTS order_payments_order_id_fkey;

ALTER TABLE order_payments
    ADD CONSTRAINT order_payments_order_id_fkey
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
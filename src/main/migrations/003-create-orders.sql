CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    storage_id INTEGER NOT NULL REFERENCES storages(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_volume DECIMAL NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    contract_status VARCHAR(10) NOT NULL DEFAULT 'UNSIGNED' CHECK (contract_status IN ('SIGNED', 'UNSIGNED')),
    payment_status VARCHAR(10) NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN ('PAID', 'UNPAID')),
    created_at DATE NOT NULL DEFAULT NOW()
);

CREATE TABLE order_cells (
     order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
     cell_id INTEGER NOT NULL REFERENCES storage_cells(id) ON DELETE CASCADE,
     PRIMARY KEY (order_id, cell_id)
);

ALTER TABLE moving_orders
    RENAME COLUMN contract_id TO order_id;

ALTER TABLE moving_orders
    DROP CONSTRAINT IF EXISTS moving_orders_contract_id_fkey;

ALTER TABLE moving_orders
    ADD CONSTRAINT moving_orders_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES orders(id);

DROP TABLE IF EXISTS contracts;
ALTER TABLE storages
    ADD COLUMN available_volume DECIMAL(10, 2);

ALTER TABLE orders
    ADD COLUMN status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
ADD COLUMN box_amount INTEGER DEFAULT 0,
ADD COLUMN cargo_mark VARCHAR(10) CHECK (cargo_mark IN ('NO', 'FRAGILE', 'HEAVY')),
ADD COLUMN product_names TEXT;

ALTER TABLE prices RENAME TO services;

ALTER TABLE services RENAME COLUMN amount TO price;

CREATE TABLE order_services (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER        NOT NULL REFERENCES orders (id),
    service_id  INTEGER        NOT NULL REFERENCES services (id),
    total_price DECIMAL(10, 2) NOT NULL
);

DROP TABLE IF EXISTS order_cells;
DROP TABLE IF EXISTS storage_cells;

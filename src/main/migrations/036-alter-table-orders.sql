ALTER TABLE orders
    ADD COLUMN extension_status VARCHAR(20) NOT NULL DEFAULT 'NO';

ALTER TABLE orders
    ADD CONSTRAINT chk_orders_extension_status
        CHECK (extension_status IN ('NO', 'PENDING', 'CANCELED'));
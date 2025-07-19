ALTER TABLE orders
    ADD COLUMN extension_status VARCHAR(20) NOT NULL DEFAULT 'NO';

ALTER TABLE orders
    ADD CONSTRAINT chk_orders_extension_status
        CHECK (extension_status IN ('NO', 'PENDING', 'CANCELED'));

ALTER TABLE orders
    DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
    ADD CONSTRAINT orders_status_check
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'APPROVED', 'PROCESSING', 'CANCELED', 'FINISHED'));
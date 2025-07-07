ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
    ADD CONSTRAINT orders_status_check
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'APPROVED', 'PROCESSING', 'CANCELED'));

ALTER TABLE order_payments DROP CONSTRAINT IF EXISTS order_payments_status_check;

ALTER TABLE order_payments
    ADD CONSTRAINT order_payments_status_check
        CHECK (status IN ('PAID', 'UNPAID', 'MANUAL', 'CANCELED'));
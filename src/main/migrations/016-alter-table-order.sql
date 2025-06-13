ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;


ALTER TABLE orders
    ADD CONSTRAINT orders_status_check
        CHECK (orders.status IN (
                        'INACTIVE',
                        'APPROVED',
                        'PROCESSING',
                        'ACTIVE'
            ));
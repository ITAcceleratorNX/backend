ALTER TABLE order_payments DROP CONSTRAINT IF EXISTS order_payments_status_check;


ALTER TABLE order_payments
    ADD CONSTRAINT order_payments_status_check
        CHECK (order_payments.status IN (
                                 'UNPAID',
                                 'PAID',
                                 'MANUAL'
            ));
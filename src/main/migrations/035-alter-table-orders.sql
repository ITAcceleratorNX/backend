ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_order_id_fkey;
ALTER TABLE order_services DROP CONSTRAINT IF EXISTS order_services_order_id_fkey;
ALTER TABLE moving_orders DROP CONSTRAINT IF EXISTS moving_orders_order_id_fkey;

ALTER TABLE contracts
    ADD CONSTRAINT contracts_order_id_fkey
        FOREIGN KEY (order_id)
            REFERENCES orders(id)
            ON DELETE CASCADE;

ALTER TABLE order_services
    ADD CONSTRAINT order_services_order_id_fkey
        FOREIGN KEY (order_id)
            REFERENCES orders(id)
            ON DELETE CASCADE;

ALTER TABLE moving_orders
    ADD CONSTRAINT moving_orders_order_id_fkey
        FOREIGN KEY (order_id)
            REFERENCES orders(id)
            ON DELETE CASCADE;
ALTER TABLE moving_orders
    DROP COLUMN address_from,
    DROP COLUMN address_to;

ALTER TABLE moving_orders
    ALTER COLUMN status TYPE VARCHAR;

DROP TYPE IF EXISTS enum_moving_orders_status;

ALTER TABLE moving_orders
    ADD CONSTRAINT moving_order_status_check
        CHECK (status IN ('PENDING_FROM','PENDING_TO','IN_PROGRESS','DELIVERED','CANCELLED'));

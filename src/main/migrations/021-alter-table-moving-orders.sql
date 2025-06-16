CREATE TYPE moving_order_status AS ENUM ('PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED');
ALTER TABLE moving_orders
    ADD COLUMN status moving_order_status NOT NULL DEFAULT 'PENDING';

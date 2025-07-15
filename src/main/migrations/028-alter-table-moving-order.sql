CREATE TYPE availability_status AS ENUM ('NOT_AVAILABLE', 'AVAILABLE');

ALTER TABLE moving_orders
    ADD COLUMN availability availability_status DEFAULT 'AVAILABLE';

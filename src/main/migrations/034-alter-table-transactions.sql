CREATE TYPE clearing_status_enum AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

ALTER TABLE transactions
ADD COLUMN clearing_status clearing_status_enum DEFAULT 'PENDING';

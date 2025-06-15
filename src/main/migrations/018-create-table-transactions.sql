CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE transactions (
                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                  order_payment_id BIGINT NOT NULL,
                  payment_id BIGINT NOT NULL,
                  operation_id BIGINT NOT NULL,
                  payment_type VARCHAR(50) NOT NULL,
                  operation_type VARCHAR(50) NOT NULL,
                  operation_status VARCHAR(50) NOT NULL,
                  error_code VARCHAR(100),
                  recurrent_token VARCHAR(255),
                  amount NUMERIC(12, 2) NOT NULL,
                  created_date VARCHAR(100) NOT NULL,
                  payment_date VARCHAR(100) NOT NULL,
                  payer_info JSONB,

                  CONSTRAINT fk_order_payment
                      FOREIGN KEY (order_payment_id)
                          REFERENCES order_payments(id)
                          ON DELETE CASCADE
);
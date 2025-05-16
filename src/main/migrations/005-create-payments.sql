CREATE TABLE order_payments (
                                id SERIAL PRIMARY KEY,
                                order_id INT NOT NULL REFERENCES orders(id),
                                month INT NOT NULL,
                                year INT NOT NULL,
                                amount DECIMAL(10, 2) NOT NULL,
                                status VARCHAR(10) CHECK (status IN ('PAID', 'UNPAID')) NOT NULL DEFAULT 'UNPAID',
                                paid_at TIMESTAMP
);

CREATE TABLE payment_transactions (
                                      id SERIAL PRIMARY KEY,
                                      order_payment_id INT NOT NULL REFERENCES order_payments(id),
                                      method VARCHAR NOT NULL,
                                      status VARCHAR(10) CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')) NOT NULL DEFAULT 'PENDING',
                                      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                      updated_at TIMESTAMP
);

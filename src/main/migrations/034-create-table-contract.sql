ALTER TABLE orders
DROP COLUMN document_id;

ALTER TABLE orders
    DROP COLUMN punct33;
CREATE TABLE contracts (
                          id SERIAL PRIMARY KEY,
                          order_id INTEGER NOT NULL REFERENCES orders(id),
                          document_id VARCHAR(50) NOT NULL UNIQUE,
                          url TEXT NOT NULL,
                          file_name TEXT NOT NULL,
                          punct33 TEXT,
                          created_at TIMESTAMP DEFAULT NOW()
);
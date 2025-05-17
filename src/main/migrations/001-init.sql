CREATE TABLE IF NOT EXISTS transaction_statuses (
    status_code VARCHAR(20) PRIMARY KEY,
    status_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    iin VARCHAR(12),
    address VARCHAR(255),
    password_hash VARCHAR(255),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    role VARCHAR(10) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER', 'MANAGER'))
);

CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(10, 8) NOT NULL,
    work_start TIME NOT NULL,
    work_end TIME NOT NULL,
    status VARCHAR(12) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'UNAVAILABLE'))
);

CREATE TABLE IF NOT EXISTS payment_systems (
    payment_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL,
    is_active BOOLEAN
);

CREATE TABLE IF NOT EXISTS prices (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INDIVIDUAL_STORAGE', 'CLOUD_STORAGE', 'RACK_STORAGE', 'MOVING')),
    amount DECIMAL(10, 2) NOT NULL,
    CONSTRAINT unique_price_type UNIQUE (type)
);

CREATE TABLE IF NOT EXISTS storages (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    name VARCHAR(50) NOT NULL,
    storage_type VARCHAR(10) NOT NULL CHECK (storage_type IN ('INDIVIDUAL', 'CLOUD', 'RACK')),
    description TEXT,
    image_url VARCHAR(255),
    height DECIMAL NOT NULL,
    total_volume DECIMAL(10, 2) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'VACANT' CHECK (status IN ('OCCUPIED', 'VACANT'))
    );

CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    storage_id INTEGER NOT NULL REFERENCES storages(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    description VARCHAR(255) NOT NULL,
    total_volume DECIMAL NOT NULL,
    item_width DECIMAL NOT NULL,
    item_length DECIMAL NOT NULL,
    item_height DECIMAL NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    deposit DECIMAL NOT NULL,
    monthly_rent_price DECIMAL NOT NULL,
    status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING','ACTIVE', 'EXPIRED', 'TERMINATED')),
    created_at DATE NOT NULL,
    updated_at DATE
);

CREATE TABLE IF NOT EXISTS moving_orders (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id),
    address_from VARCHAR(255) NOT NULL,
    address_to VARCHAR(255) NOT NULL,
    moving_date TIMESTAMP,
    vehicle_type VARCHAR(10) NOT NULL CHECK (vehicle_type IN ('SMALL', 'MEDIUM', 'LARGE'))
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notification_type VARCHAR(10) DEFAULT 'general' CHECK (notification_type IN ('order', 'payment', 'contract', 'general')),
    related_order_id INTEGER
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    payment_id INTEGER NOT NULL REFERENCES payment_systems(payment_id),
    amount DECIMAL(10, 2) NOT NULL,
    status_code VARCHAR(20) NOT NULL REFERENCES transaction_statuses(status_code),
    transaction_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS callbacks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('NEW', 'PROCESSED')),
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chats (
    user_id INTEGER,
    manager_id INTEGER,
    status VARCHAR(255) -- значения: 'PENDING', 'ACCEPTED', 'CLOSED'
);

CREATE TABLE IF NOT EXISTS faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    chat_id INTEGER,
    sender_id INTEGER,
    text VARCHAR(255),
    is_from_user BOOLEAN
);
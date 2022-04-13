CREATE SCHEMA orders;
CREATE USER order_user WITH PASSWORD 'password';

CREATE TABLE IF NOT EXISTS orders.orders (
    order_id SERIAL,
    user_id BIGINT,
    price INTEGER,
    status VARCHAR,
    timestamp TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders.lock_table (
    key VARCHAR UNIQUE
);

CREATE TYPE saga_orchestrator_state AS ENUM ('pending', 'processed', 'confirmed', 'rejected');
CREATE TABLE IF NOT EXISTS orders.saga_transactions (
    transaction_id SERIAL,
    saga_key VARCHAR,
    step INTEGER,
    state saga_orchestrator_state,
    UNIQUE (saga_key, step)
);

GRANT CONNECT ON DATABASE otusdb TO order_user;
GRANT ALL PRIVILEGES ON SCHEMA orders TO order_user;
GRANT ALL ON ALL TABLES IN SCHEMA orders TO order_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA orders TO order_user;

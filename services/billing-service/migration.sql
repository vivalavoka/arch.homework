CREATE SCHEMA billing;
CREATE USER billing_user WITH PASSWORD 'password';
CREATE TABLE IF NOT EXISTS billing.balances (
    user_id BIGINT UNIQUE,
    value INTEGER
);

CREATE TABLE IF NOT EXISTS billing.lock_table (
    key VARCHAR UNIQUE
);

CREATE TYPE saga_state AS ENUM ('pending', 'accepted', 'rejected');
CREATE TABLE IF NOT EXISTS billing.processed_messages (
    transaction_id SERIAL,
    saga_key VARCHAR,
    state saga_state,
    data JSONB,
    UNIQUE (saga_key, transaction_id)
);

GRANT CONNECT ON DATABASE otusdb TO billing_user;
GRANT ALL PRIVILEGES ON SCHEMA billing TO billing_user;
GRANT ALL ON ALL TABLES IN SCHEMA billing TO billing_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA billing TO billing_user;

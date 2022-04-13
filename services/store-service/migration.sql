CREATE SCHEMA store;
CREATE USER store_user WITH PASSWORD 'password';
CREATE TABLE IF NOT EXISTS store.remnants (
    onerow_id BOOLEAN PRIMARY KEY DEFAULT TRUE,
    value INTEGER,
    CONSTRAINT onerow_uni CHECK (onerow_id)
);

-- CREATE TYPE saga_state AS ENUM ('pending', 'accepted', 'rejected');
CREATE TABLE IF NOT EXISTS store.processed_messages (
    transaction_id SERIAL,
    saga_key VARCHAR,
    state saga_state,
    data JSONB
);

GRANT CONNECT ON DATABASE otusdb TO store_user;
GRANT ALL PRIVILEGES ON SCHEMA store TO store_user;
GRANT ALL ON ALL TABLES IN SCHEMA store TO store_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA store TO store_user;

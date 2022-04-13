CREATE SCHEMA delivery;
CREATE USER delivery_user WITH PASSWORD 'password';
CREATE TABLE IF NOT EXISTS delivery.routes (
    order_id VARCHAR,
    route_status VARCHAR
);

-- CREATE TYPE saga_state AS ENUM ('pending', 'accepted', 'rejected');
CREATE TABLE IF NOT EXISTS delivery.processed_messages (
    transaction_id SERIAL,
    saga_key VARCHAR,
    state saga_state,
    data JSONB
); 

GRANT CONNECT ON DATABASE otusdb TO delivery_user;
GRANT ALL PRIVILEGES ON SCHEMA delivery TO delivery_user;
GRANT ALL ON ALL TABLES IN SCHEMA delivery TO delivery_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA delivery TO delivery_user;

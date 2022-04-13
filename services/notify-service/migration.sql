CREATE SCHEMA notify;
CREATE USER notify_user WITH PASSWORD 'password';
CREATE TABLE IF NOT EXISTS notify.messages (
    message_id SERIAL,
    user_id BIGINT,
    email VARCHAR,
    body TEXT,
    timestamp TIMESTAMP DEFAULT now()
);

GRANT CONNECT ON DATABASE otusdb TO notify_user;
GRANT ALL PRIVILEGES ON SCHEMA notify TO notify_user;
GRANT ALL ON ALL TABLES IN SCHEMA notify TO notify_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA notify TO notify_user;

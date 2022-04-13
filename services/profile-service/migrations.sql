CREATE SCHEMA profile;
CREATE USER profile_user WITH PASSWORD 'password';
CREATE TABLE IF NOT EXISTS profile.users (
    user_id INTEGER UNIQUE,
    email VARCHAR,
    phone VARCHAR,
    username VARCHAR
);

GRANT CONNECT ON DATABASE otusdb TO profile_user;
GRANT ALL PRIVILEGES ON SCHEMA profile TO profile_user;
GRANT ALL ON ALL TABLES IN SCHEMA profile TO profile_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA profile TO profile_user;

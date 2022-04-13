const { Client } = require('pg');

const config = {
    database: process.env.POSTGRES_DB || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const client = new Client(config);

client.connect();

module.exports = {
    query: (text, params) => client.query(text, params),
    close: () => client.end(),
}

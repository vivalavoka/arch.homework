const db = require('../libs/db');

const table = 'auth.users';

module.exports = {
    get: async ({ email, password }) => {
        const { rows } = await db.query(`SELECT id, email, phone, username FROM ${table} WHERE email = $1 AND password = crypt($2, password) LIMIT 1;`, [email, password]);
        return rows[0];
    },
    create: async ({ username, email, phone, password }) => {
        const { rows } = await db.query(`INSERT INTO ${table} (username, email, phone, password) VALUES ($1, $2, $3, crypt($4, gen_salt('bf', 8))) RETURNING id;`, [username, email, phone, password]);
        return { id: rows[0].id };
    },
}
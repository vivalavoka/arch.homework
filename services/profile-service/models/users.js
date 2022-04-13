const db = require('../libs/db');

const table = 'profile.users';

module.exports = {
    create: async ({ user_id, username, email, phone }) => {
        const { rows } = await db.query(`INSERT INTO ${table} (user_id, username, email, phone) VALUES ($1, $2, $3, $4) RETURNING user_id;`, [user_id, username, email, phone]);
        return { user_id: rows[0].user_id };
    },
    update: async ({ username, email, phone, id }) => {
        const { rows } = await db.query(`UPDATE ${table} SET username = $1, email = $2, phone = $3 WHERE user_id = $4`, [username, email, phone, id]);
    },
    get: async ({ id }) => {
        const { rows } = await db.query(`SELECT username, email, phone FROM ${table} WHERE user_id = $1`, [id]);
        return rows[0];
    },
}
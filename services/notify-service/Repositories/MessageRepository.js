const db = require('../Adapters/Db');

const tableName = 'notify.messages';

module.exports = {
    create: async ({ user_id, email, body }) => {
        const { rows } = await db.query(`INSERT INTO ${tableName} (user_id, email, body) VALUES ($1, $2, $3) RETURNING message_id;`, [user_id, email, body]);
        return { message_id: rows[0].message_id };
    },
    get: async ({ user_id }) => {
        const { rows } = await db.query(`SELECT message_id, email, body, timestamp FROM ${tableName} WHERE user_id = $1;`, [user_id]);
        return rows;
    },
}
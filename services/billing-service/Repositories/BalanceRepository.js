const pool = require('../Adapters/Db');

const tableName = 'billing.balances';

module.exports = class BalanceRepository {
    constructor(client = pool) {
        this.client = client;
    }

    static get(client) {
        return new BalanceRepository(client);
    }

    async create({ user_id, value }) {
        await this.client.query(`INSERT INTO ${tableName} (user_id, value) VALUES ($1, $2);`, [user_id, value]);
    }

    async getBalance({ user_id }) {
        const { rows } = await this.client.query(`SELECT value FROM ${tableName} WHERE user_id = $1;`, [user_id]);
        return rows[0];
    }

    async payIn({ user_id, value }) {
        const { rows } = await this.client.query(`UPDATE ${tableName} SET value = value + $1 WHERE user_id = $2 RETURNING value;`, [value, user_id]);
        return rows[0];
    }

    async payOut({ user_id, value }) {
        const { rows } = await this.client.query(`UPDATE ${tableName} SET value = value - $1 WHERE user_id = $2 RETURNING value;`, [value, user_id]);
        return rows[0];
    }
};

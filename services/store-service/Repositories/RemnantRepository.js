const pool = require('../Adapters/Db');

const tableName = 'store.remnants';

module.exports = class RemnantRepository {
    constructor(client = pool) {
        this.client = client;
    }

    static get(client) {
        return new RemnantRepository(client);
    }

    async create({ value }) {
        const {rows} = await this.client.query(`INSERT INTO ${tableName} (value) VALUES ($1) ON CONFLICT DO NOTHING;`, [value]);
        return rows[0];
    }

    async getRemnants() {
        const { rows } = await this.client.query(`SELECT value FROM ${tableName} LIMIT 1;`);
        return rows[0];
    }

    async increase({ value }) {
        const { rows } = await this.client.query(`UPDATE ${tableName} SET value = value + $1 RETURNING value;`, [value]);
        return rows[0];
    }

    async decrease({ value }) {
        const { rows } = await this.client.query(`UPDATE ${tableName} SET value = value - $1 RETURNING value;`, [value]);
        return rows[0];
    }
};

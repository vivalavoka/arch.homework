const pool = require('../Adapters/Db');

const tableName = 'orders.orders';

module.exports = class OrderRepository {
    constructor(client = pool) {
        this.client = client;
    }

    static get(client) {
        return new OrderRepository(client);
    }

    async create({ user_id, price, status }) {
        const {rows} = await this.client.query(`INSERT INTO ${tableName} (user_id, price, status) VALUES ($1, $2, $3) RETURNING order_id, status;`, [user_id, price, status]);
        return {order_id: rows[0].order_id, status: rows[0].status};
    }

    async get({ order_id }) {
        const { rows } = await this.client.query(`SELECT order_id, user_id, price, status FROM ${tableName} WHERE order_id = $1;`, [order_id]);
        return rows[0];
    }

    async list({ user_id }) {
        const { rows } = await this.client.query(`SELECT order_id, price, status FROM ${tableName} WHERE user_id = $1;`, [user_id]);
        return rows;
    }

    async updateStatus({ order_id, status }) {
        const { rows } = await this.client.query(`UPDATE ${tableName} SET status = $1 WHERE order_id = $2 RETURNING status;`, [status, order_id]);
        return {status: rows[0].status};
    }
}
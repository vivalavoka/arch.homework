const pool = require('../Adapters/Db');
const RoutesStatus = require('../Constants/RoutesStatus');

const tableName = 'delivery.routes';

module.exports = class RouteRepository {
    constructor(client = pool) {
        this.client = client;
    }

    static get(client) {
        return new RouteRepository(client);
    }

    async getRoute({ order_id }) {
        const { rows } = await this.client.query(`SELECT order_id, route_status FROM ${tableName} WHERE order_id = $1;`, [order_id]);
        return rows[0];
    }

    async onRoute({ order_id }) {
        const {rows} = await this.client.query(`INSERT INTO ${tableName} (order_id, route_status) VALUES ($1, $2);`, [order_id, RoutesStatus.on_route]);
        return rows[0];
    }

    async delivered({ order_id }) {
        const { rows } = await this.client.query(`UPDATE ${tableName} SET route_status = $1 WHERE order_id = $2 RETURNING route_status;`, [RoutesStatus.delivered, order_id]);
        return rows[0];
    }

    async cancel({ order_id }) {
        const { rows } = await this.client.query(`UPDATE ${tableName} SET route_status = $1 WHERE order_id = $2 RETURNING route_status;`, [RoutesStatus.cancelled, order_id]);
        return rows[0];
    }
};

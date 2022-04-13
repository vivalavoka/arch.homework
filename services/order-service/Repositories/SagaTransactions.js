const pool = require('../Adapters/Db');
const SagaErrors = require('../Errors/SagaErrors');
const JsonError = require('../Libs/JsonError');
const SagaStates = require('../Constants/SagaStates');

const tableName = 'orders.saga_transactions';

module.exports = class SagaTransactions {
    constructor(client = pool) {
        this.client = client;
    }

    static get(client) {
        return new SagaTransactions(client);
    }

    async getSteps({ saga_key }) {
        const { rows } = await this.client.query(`SELECT (transaction_id, saga_key, step, state) FROM ${tableName} WHERE saga_key = $1`, [saga_key]);

        return rows;
    }

    async getByTxId({ transaction_id }) {
        const { rows } = await this.client.query(`SELECT transaction_id, saga_key, step, state FROM ${tableName} WHERE transaction_id = $1`, [transaction_id]);

        return rows[0];
    }

    async getBySagaStep({ saga_key, step }) {
        const { rows } = await this.client.query(`SELECT (transaction_id, saga_key, step, state) FROM ${tableName} WHERE saga_key = $1 AND step = $2`, [saga_key, step]);

        return rows[0];
    }

    async create({ saga_key, step }) {
        const { rows } = await this.client.query(`INSERT INTO ${tableName} (saga_key, step, state) VALUES ($1, $2, $3) RETURNING transaction_id;`, [saga_key, step, SagaStates.pending])
            .catch(error => {
                if (error.code === '23505')
                    throw new JsonError(SagaErrors.saga_created);
            });

        return rows[0];
    }

    async process({ transaction_id }) {
        await this.client.query(`UPDATE ${tableName} SET state = $1 WHERE transaction_id = $2;`, [SagaStates.processed, transaction_id]);
    }

    async confirm({ transaction_id }) {
        await this.client.query(`UPDATE ${tableName} SET state = $1 WHERE transaction_id = $2;`, [SagaStates.confirmed, transaction_id]);
    }

    async reject({ transaction_id }) {
        await this.client.query(`UPDATE ${tableName} SET state = $1 WHERE transaction_id = $2;`, [SagaStates.rejected, transaction_id]);
    }
};

const pool = require('../Adapters/Db');
const SagaErrors = require('../Errors/SagaErrors');
const JsonError = require('../Libs/JsonError');
const SagaStates = require('../Saga/SagaStates');

const tableName = 'billing.processed_messages';

module.exports = class SageTransactions {
    constructor(client = pool) {
        this.client = client;
    }

    static get(client) {
        return new SageTransactions(client);
    }

    async getData({ saga_key }) {
        const {rows} = await this.client.query(`SELECT data FROM ${tableName} WHERE saga_key = $1;`, [saga_key]);

        return rows[0];
    }

    async create({ saga_key, data }) {
        await this.client.query(`INSERT INTO ${tableName} (saga_key, state, data) VALUES ($1, $2, $3);`, [saga_key, SagaStates.pending, data])
            .catch(error => {
                if (error.code === '23505')
                    throw new JsonError(SagaErrors.saga_created);
            });
    }

    async accept({ saga_key }) {
        await this.client.query(`UPDATE ${tableName} SET state = $1 WHERE saga_key = $2;`, [SagaStates.accepted, saga_key]);
    }

    async reject({ saga_key }) {
        await this.client.query(`UPDATE ${tableName} SET state = $1 WHERE saga_key = $2;`, [SagaStates.rejected, saga_key]);
    }
};

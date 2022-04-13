const pool = require('../Adapters/Db');
const LockErrors = require('../Errors/LockErrors');
const JsonError = require('../Libs/JsonError');

const tableName = 'orders.lock_table';

module.exports = class LockRepository {
    constructor(client = pool) {
        this.client = client;
    }

    static get(client) {
        return new LockRepository(client);
    }

    async setLock({ key }) {
        await this.client.query(`INSERT INTO ${tableName} (key) VALUES ($1);`, [key])
            .catch(error => {
                if (error.code === '23505')
                    throw new JsonError(LockErrors.locked);
            });
    }
};

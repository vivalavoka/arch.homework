const pool = require('../Adapters/Db');

class Transaction {};
module.exports = class PgTransaction extends Transaction {
    constructor(client) {
        super();
        this._onCommitCallbacks = [];
        this._onAbortCallbacks = [];

        this._client = client;
    }

    static async init() {
        const client = await pool.connect();

        await client.query('BEGIN');
        return new PgTransaction(client);
    }

    get id() {
        return this._id;
    }

    get client() {
        return this._client;
    }

    onCommit(callback) {
        this._onCommitCallbacks(callback);
    }

    async commit() {
        await this._client.query('COMMIT');
        for (const callback of this._onCommitCallbacks) {
            await callback();
        }
        this.release();
    }

    async abort() {
        await this._client.query('ROLLBACK');
        this.release();
    }

    release() {
        this._client.release();
    }
}
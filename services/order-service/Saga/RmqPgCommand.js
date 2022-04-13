class SagaCommand {}

module.exports = class OrderCommand extends SagaCommand {
    static async init() {
        const command = new OrderCommand();
        return command;
    }
    set tx(tx) {
        this._tx = tx;
    }
    get tx() {
        return this._tx;
    }

    set action(action) {
        this._action = action;
    }
    get action() {
        return this._action;
    }
    set step(step) {
        this._step = step;
    }
    get step() {
        return this._step;
    }
    set handler(handler) {
        this._handler = handler;
    }
    get handler() {
        return this._handler;
    }

    set saga_key(saga_key) {
        this._saga_key = saga_key;
    }
    get saga_key() {
        return this._saga_key;
    }

    set transaction_id(transaction_id) {
        this._transaction_id = transaction_id;
    }
    get transaction_id() {
        return this._transaction_id;
    }

    set data(data) {
        this._data = data;
    }
    get data() {
        return this._data;
    }

    set status(status) {
        this._status = status;
    }
    get status() {
        return this._status;
    }

    set saga_data(saga_data) {
        this._saga_data = saga_data;
    }
    get saga_data() {
        return this._saga_data || {};
    }

    set reason(reason) {
        this._reason = reason;
    }
    get reason() {
        return this._reason || {};
    }

    get result() {
        return {
            saga_key: this.saga_key,
            action: this.action,
            status: this.status,
            ...this.reason && {reason: this.reason},
        }
    }
}
// RPC server
const {v4: uuid} = require('uuid');
const EventEmitter = require('events');
const rmq = require('../Adapters/Rmq');
const {CORRELATION_ID} = require('../Constants/Headers');

const RPC_ACTION = {
    payment: 'payment',
    getBalance: 'getBalance',
};

class BillingRpcClient extends EventEmitter {
    async init() {
        this.send = await rmq.registerRpcClient('rpc_exchange', 'billing_service', (...args) => {
            this._responseHandler(...args)
                .catch(console.error)
        });
    }

    async _responseHandler(message) {
        this.emit(message.properties.correlationId, message);
    }

    async orderPayment(data, {correlation_id}) {
        return new Promise((res, rej) => {
            const requestId = uuid();
            this.once(requestId, (message, ...args) => {
                const response = JSON.parse(message.content.toString());
                if (response.status === 'success')
                    return res(response);
                return rej(response);
            });
            this.send(requestId, JSON.stringify({
                action: RPC_ACTION.payment,
                data,
            }), {
                [CORRELATION_ID]: correlation_id,
            });
        });
    }

    async getBalance(data) {
        return new Promise((res, rej) => {
            const requestId = uuid();
            this.once(requestId, (message) => {
                const response = JSON.parse(message.content.toString());
                if (response.status === 'success')
                    return res({response});
                return rej(response);
            });
            this.send(requestId, JSON.stringify({
                action: RPC_ACTION.getBalance,
                data,
            }));
        });
    }
}

module.exports = new BillingRpcClient();
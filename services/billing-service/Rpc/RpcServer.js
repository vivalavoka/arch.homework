// RPC server
const rmq = require('../Adapters/Rmq');
const balanceService = require('../Services/BalanceService');
const {CORRELATION_ID} = require('../Constants/Headers');

const EVENTS = {
    payment: 'payment',
    getBalance: 'getBalance',
};

class RpcServer {
    async init() {
        await rmq.registerRPCServer('rpc_exchange', 'billing_service', (...args) => {
            return this.eventHandler(...args)
                .then((data) => ({
                    response: JSON.stringify({status: 'success', data}),
                }))
                .catch((error) => {
                    return {
                       response: JSON.stringify({status: 'failed', data: {message: error.message}})
                    }
                });
        });
    }

    async eventHandler(message) {
        const {action, data} = JSON.parse(message.content.toString());

        switch (action) {
            case EVENTS.payment: {
                // pay out
                const correlation_id = message.properties.headers[CORRELATION_ID];
                
                const {user_id, price} = data;
                const {balance} = await balanceService.payOut({user_id, amount: price }, { correlation_id });
                return { balance };
            }
            case EVENTS.getBalance: {
                const {user_id} = data;
                const { balance } = await balanceService.getBalance({user_id})
                return { balance };
            }
            default:
                console.error(`Invalid action: ${action}`);
        }
    }
}

module.exports = new RpcServer();
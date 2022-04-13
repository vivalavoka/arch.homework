const process = require('process');

const db = require('./Adapters/Db');
const rmq = require('./Adapters/Rmq');
const authConsumer = require('./Consumers/AuthConsumer');
const restApi = require('./Adapters/RestApi');
const RpcServer = require('./Rpc/RpcServer');
const OrderSagaConsumer = require('./Saga/OrderSagaConsumer');

(async () => {
    process.on('SIGINT', () => process.exit(0));
    await db.connect();

    await restApi.init();
    await rmq.connect();

    await authConsumer.init();

    // await RpcServer.init();
    await OrderSagaConsumer.init();
})();
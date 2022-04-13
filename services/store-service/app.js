const process = require('process');

const db = require('./Adapters/Db');
const rmq = require('./Adapters/Rmq');
const restApi = require('./Adapters/RestApi');
const OrderSagaConsumer = require('./Saga/OrderSagaConsumer');

const Bootstrap = require('./Bootstrap');

(async () => {
    process.on('SIGINT', () => process.exit(0));
    await db.connect();

    await restApi.init();
    await rmq.connect();

    await OrderSagaConsumer.init();

    await Bootstrap();
})();
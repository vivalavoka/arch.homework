const process = require('process');

const db = require('./Adapters/Db');
const rmq = require('./Adapters/Rmq');
const restApi = require('./Adapters/RestApi');
const OrderEventPublisher = require('./Publishers/OrderEventPublisher');

(async () => {
    process.on('SIGINT', () => process.exit(0));
    await db.connect();

    await restApi.init();
    await rmq.connect();

    await OrderEventPublisher.init();
    // await OrderSagaClient.init();
})();
const process = require('process');

const db = require('./Adapters/Db');
const rmq = require('./Adapters/Rmq');
const eventConsumer = require('./Consumers/EventConsumer');
const restApi = require('./Adapters/RestApi');

(async () => {
    process.on('SIGINT', () => process.exit(0));
    await db.connect();

    await restApi.init();
    await rmq.connect();

    await eventConsumer.init();
})();
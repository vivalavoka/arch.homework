const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const promMiddleware = require('./middlewares/prometheus');

const routes = require('./routes');

const rmq = require('./libs/rmq');
const authConsumer = require('./consumers/auth-consumer');

(async () => {
    const jsonParser = bodyParser.json();

    const app = express();
    app.use(jsonParser);
    app.use(cookieParser());
    app.use(promMiddleware);
    routes(app);

    process.on('SIGINT', () => process.exit(0));

    app.get('/', (request, response) => {
        response.send('OK');
    });

    const port = process.env.SERVICE_PORT || 8000;
    app.listen(port, (err) => {
        if (err) {
            return console.log('something happened', err);
        }
        console.log(`server is listening on ${port}`);
    });
    await rmq.connect();

    await authConsumer.init();
})();

const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const rmq = require('./libs/rmq');

const routes = require('./routes');

const jsonParser = bodyParser.json();

const app = express();
app.use(cookieParser());
app.use(jsonParser);
app.use(morgan('combined'));
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

    rmq.connect();
});

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const config = {
    port: process.env.REST_API_PORT || 8000,
}

class RestApi {
    constructor(config) {
        this._config = config;
        this._app = express();
        this._app.use(bodyParser.json());
        this._app.use(cookieParser());
        routes(this._app);
    }

    async init() {
        return new Promise((res, rej) => {
            const {port} = this._config;
            this._app.listen(port, (err) => {
                if (err) {
                    return rej(err);
                }
                console.log(`server is listening on ${port}`);
                res();
            });
        });
    }
}

module.exports = new RestApi(config);

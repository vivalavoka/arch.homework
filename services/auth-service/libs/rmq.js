const amqp = require('amqplib');

const config = {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: process.env.RABBITMQ_PORT || 5672,
    user: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
};
class Rmq {
    constructor(config) {
        this._config = config;
        this._connection;
        this._channel;
    }

    async connect() {
        const {host, port, user, password} = this._config;
        const creds = user ? `${user}:${password}@` : '';
        this._connection = await amqp.connect(`amqp://${creds}${host}:${port}`)

        process.once('SIGINT', () => this._connection.close());
        this._channel = await this._connection.createChannel();
        console.log('Connection inited');
    }

    getConnection() {
        return this._connection;
    }

    getChannel() {
        return this._channel;
    }
}

module.exports = new Rmq(config);

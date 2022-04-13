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

    async registerConsumer(exchangeName, queueName, callback) {
        await this._channel.assertExchange(exchangeName, 'direct');
  
        const queue = await this._channel.assertQueue(queueName);

        await this._channel.bindQueue(queue.queue, exchangeName);

        await this._channel.consume(queueName, callback, {
            noAck: true,
        });

        console.log('Consumer registered');
    }

    async registerRPCServer(exchangeName, queueName, callback) {
        await this._channel.assertExchange(exchangeName, 'direct');

        const queue = await this._channel.assertQueue(queueName);

        await this._channel.bindQueue(queue.queue, exchangeName);

        await this._channel.consume(queueName, async (msg) => {
            msg.body = JSON.parse(msg.content.toString());
            const response = await callback(msg);

            this._channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(JSON.stringify(response)), {
                    correlationId: msg.properties.correlationId,
                    headers: msg.properties.headers,
                });

            this._channel.ack(msg);
        });
    }
}

module.exports = new Rmq(config);

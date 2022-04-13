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

        this._channel.bindQueue(queue.queue, exchangeName);

        await this._channel.consume(queueName, callback);

        console.log('Consumer registered');
    }

    async registerPublisher(exchangeName) {
        await this._channel.assertExchange(exchangeName, 'direct');

        return (payload, key = '') => {
            return this._channel.publish(exchangeName, key, Buffer.from(JSON.stringify(payload)));
        }
    }

    async registerRpcClient(exchangeName, requestQueue, responseCallback) {
        await this._channel.assertExchange(exchangeName, 'direct');

        const queue = await this._channel.assertQueue('', {
            exclusive: true,
        });

        await this._channel.bindQueue(queue.queue, exchangeName);

        await this._channel.consume(queue.queue, responseCallback);

        return (correlationId, msg, headers = {}) => {
            return this._channel.sendToQueue(requestQueue, Buffer.from(msg),
                {
                    correlationId: correlationId,
                    replyTo: queue.queue,
                    headers,
                });
        }
    }

    async registerRPCServer(exchangeName, queueName, requestHandler) {
        await this._channel.assertExchange(exchangeName, 'direct');

        const queue = await this._channel.assertQueue(queueName);

        await this._channel.bindQueue(queue.queue, exchangeName);

        await this._channel.consume(queueName, async (msg) => {
            const {response, headers = {}} = await requestHandler(msg);

            this._channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(response), {
                    correlationId: msg.properties.correlationId,
                    headers,
                });

            this._channel.ack(msg);
        });
    }

    async registerSagaClient(exchangeName, responseQueue) {
        await this._channel.assertExchange(exchangeName, 'direct');

        return (requestQueue, correlationId, msg, headers = {}) => {
            console.log('Send msg: ', msg);
            return this._channel.sendToQueue(requestQueue, Buffer.from(JSON.stringify(msg)),
                {
                    correlationId,
                    replyTo: responseQueue,
                    headers,
                });
        }
    }
}

module.exports = new Rmq(config);

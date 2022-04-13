// Публикация пользовательских событий
const rmq = require('../libs/rmq');

const EVENT_EXCHANGE = 'auth_events';

const EVENTS = {
    userCreated: 'userCreated',
};

class AuthEventPublisher {
    async _publish(payload, key = '') {
        rmq.getChannel().assertExchange(EVENT_EXCHANGE, 'direct', {
            durable: true,
        });
        rmq.getChannel().publish(EVENT_EXCHANGE, key, Buffer.from(JSON.stringify(payload)));

        console.log('Message event published: ', payload);
    }

    async userCreated(data) {
        return this._publish({
            action: EVENTS.userCreated,
            data,
        }).catch((error) => console.error(error));
    }
}

module.exports = new AuthEventPublisher();
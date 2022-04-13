// Публикация пользовательских событий
const Rmq = require('../Adapters/Rmq');

const EVENT_EXCHANGE = 'orders_events';

const EVENTS = {
    orderAccepted: 'orderAccepted',
    orderRejected: 'orderRejected',
};

class OrderEventPublisher {
    async init() {
        this.publish = await Rmq.registerPublisher(EVENT_EXCHANGE);
    }

    orderAccepted({id, email, order_id}) {
        return this.publish({
            action: EVENTS.orderAccepted,
            data: {
                user_id: id,
                email,
                order_id,
            },
        });
    }

    orderRejected({id, email, reason, order_id}) {
        return this.publish({
            action: EVENTS.orderRejected,
            data: {
                user_id: id,
                email,
                order_id,
                reason,
            },
        });
    }
}

module.exports = new OrderEventPublisher();
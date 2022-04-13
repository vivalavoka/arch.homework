// Слушатель пользовательских событий
const rmq = require('../Adapters/Rmq');
const messageService = require('../Services/MessageService');

const EVENTS = {
    userCreated: 'userCreated',
    orderAccepted: 'orderAccepted',
    orderRejected: 'orderRejected',
};

class EventConsumer {
    async init() {
        await rmq.registerConsumer('auth_events', 'notify_consumer', (...args) => {
            this.eventHandler(...args)
                .catch(console.error);
        });
        await rmq.registerConsumer('orders_events', 'notify_consumer', (...args) => {
            this.eventHandler(...args)
                .catch(console.error);
        });
        console.log('Event consumers registered');
    }

    async eventHandler(message) {
        const {action, data} = JSON.parse(message.content.toString());
        console.log('action, data: ', action, data);

        switch (action) {
            case EVENTS.userCreated: {
                // create balance
                const {user_id, email} = data;
                return messageService.sendMessage({
                    user_id,
                    email,
                    body: 'Поздравляем! Вы только что зарегистрировались!',
                });
            }
            case EVENTS.orderAccepted: {
                const {user_id, email, order_id} = data;
                return messageService.sendMessage({
                    user_id,
                    email,
                    body: `Заказ #${order_id} успешно создан`,
                });
            }
            case EVENTS.orderRejected: {
                const {user_id, email, order_id, reason} = data;
                return messageService.sendMessage({
                    user_id,
                    email,
                    body: `Не удалось создать заказ #${order_id}. ${reason}`,
                });
            }
            default:
                console.error(`Invalid action: ${action}`);
        }
    }
}

module.exports = new EventConsumer();
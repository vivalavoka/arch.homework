// Слушатель пользовательских событий
const rmq = require('../Adapters/Rmq');
const balanceService = require('../Services/BalanceService');

const EVENTS = {
    userCreated: 'userCreated',
};

class AuthConsumer {
    async init() {
        await rmq.registerConsumer('auth_events', 'billing_events', (...args) => {
            this.eventHandler(...args)
                .catch(console.error);
        });
    }

    async eventHandler(message) {
        const {action, data} = JSON.parse(message.content.toString());

        switch (action) {
            case EVENTS.userCreated:
                // create balance
                const {user_id} = data;
                await balanceService.createBalance({user_id});
                break;
            default:
                console.error(`Invalid action: ${action}`);
        }
    }
}

module.exports = new AuthConsumer();
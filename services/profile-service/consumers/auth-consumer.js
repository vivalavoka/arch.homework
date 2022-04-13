// Слушатель пользовательских событий
const rmq = require('../libs/rmq');
const users = require('../models/users');

const EVENTS = {
    userCreated: 'userCreated',
};

class AuthConsumer {
    async init() {
        await rmq.registerConsumer('auth_events', 'profile_events', (...args) => {
            this.eventHandler(...args)
                .catch(console.error);
        });
    }

    async eventHandler(message) {
        const {action, data} = JSON.parse(message.content.toString());

        switch (action) {
            case EVENTS.userCreated:
                // create account
                const {user_id, username, email, phone} = data;
                await users.create({user_id, username, email, phone});
                break;
            default:
                console.error(`Invalid action: ${action}`);
        }
    }
}

module.exports = new AuthConsumer();
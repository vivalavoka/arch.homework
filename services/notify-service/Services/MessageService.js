const MessageRepository = require('../Repositories/MessageRepository');

class MessageService {
    async sendMessage({ user_id, email, body }) {
        await MessageRepository
            .create({ user_id, email, body })
            .catch((error) => {
                if (error.code !== '23505') {
                    throw error;
                }
            });
    }

    async getMessages({ user_id }) {
        return MessageRepository.get({ user_id });
    }
}

module.exports = new MessageService();

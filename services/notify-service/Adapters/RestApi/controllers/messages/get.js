const messageService = require('../../../../Services/MessageService');

module.exports = async (req, res) => {
    const {session} = req.state;
    const {id} = session;

    const messages = await messageService.getMessages({ user_id: id });

    res.send(messages);
}

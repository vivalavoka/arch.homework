const users = require('../../models/users');
const authEventPublisher = require('../../publisher/auth-event-publisher');

module.exports = async (req, res) => {
    const { username, email, phone, password } = req.body;

    try {
        const {id} = await users.create({ username, email, phone, password });

        authEventPublisher.userCreated({user_id: id, username, email, phone});

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message || error);
    }
}

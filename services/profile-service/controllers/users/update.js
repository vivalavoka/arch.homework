const users = require('../../models/users');

module.exports = async (req, res) => {
    const { username, email, phone } = req.body;

    const {session} = req.state;
    const {id} = session;

    const user = await users.get({id});

    if (!user) {
        return res.status(400).send('Not Found');
    }

    try {
        await users.update({
            id,
            username: username || user.username,
            email: email || user.email,
            phone: phone || user.phone,
        });

        res.json({ status: 'OK' });
    } catch (error) {
        res.status(500).send(error.message || error);
    }
}

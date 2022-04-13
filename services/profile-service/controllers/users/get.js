const users = require('../../models/users');

module.exports = async (req, res) => {
    const {session} = req.state;
    const {id} = session;

    const user = await users.get({ id });

    if (!user) {
        return res.status(400).send('Not Found');
    }
    res.send(user);
}

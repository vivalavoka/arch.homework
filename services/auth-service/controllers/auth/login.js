const jwt = require('jsonwebtoken');
const users = require('../../models/users');
const sessions = require('../../models/sessions');
const {SESSION_ID, AUTH_TOKEN} = require('../../constants/headers');

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

module.exports = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await users.get({ email, password });

        if (user) {
            const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: '1d' });
            const sessionId = sessions.create({
                [AUTH_TOKEN]: accessToken,
            });
            return res
                .cookie(SESSION_ID, sessionId)
                .sendStatus(204);
        }
        return res.sendStatus(403);
    } catch (error) {
        res
            .status(500)
            .send(error.message || error);
    }
}

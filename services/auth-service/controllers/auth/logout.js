const sessions = require('../../models/sessions');
const {SESSION_ID} = require('../../constants/headers');

module.exports = async (req, res) => {
    try {
        const sessionId = req.cookies[SESSION_ID];
        sessions.drop(sessionId);
        res.clearCookie(SESSION_ID);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message || error);
    }
}

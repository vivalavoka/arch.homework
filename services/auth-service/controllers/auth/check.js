const sessions = require('../../models/sessions');
const {SESSION_ID} = require('../../constants/headers');

module.exports = async (req, res) => {
    try {
        const sessionId = req.cookies[SESSION_ID];

        if (!sessionId)
            return res.sendStatus(401);

        const session = sessions.get(sessionId);
        
        if (!session)
            return res.sendStatus(401);

        return res
            .set(session)
            .sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message || error);
    }
}

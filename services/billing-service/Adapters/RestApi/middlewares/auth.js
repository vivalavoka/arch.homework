const jwt = require('jsonwebtoken');
const {AUTH_TOKEN} = require('../../../Constants/Headers');

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

module.exports = (req, res, next) => {
    const token = req.headers[AUTH_TOKEN];

    if (!token)
        return res.sendStatus(401);

    try {
        const session = jwt.verify(token, SECRET_KEY);
        if (!req.state) {
            req.state = {};
        }

        req.state.session = session;
        next();
    } catch(error) {
        return res.sendStatus(403);
    }
}
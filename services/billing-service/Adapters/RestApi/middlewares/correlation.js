const {CORRELATION_ID} = require('../../../Constants/Headers');

module.exports = (req, res, next) => {
    const correlation_id = req.headers[CORRELATION_ID];

    if (!correlation_id)
        return res.sendStatus(400);

    try {
        if (!req.state) {
            req.state = {};
        }

        req.state.correlation_id = correlation_id;
        next();
    } catch(error) {
        return res.sendStatus(403);
    }
}
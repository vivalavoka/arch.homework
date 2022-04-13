const jwt = require('jsonwebtoken');
const JsonError = require('../../../Libs/JsonError');
const AuthErrors = require('../../../Errors/AuthErrors');
const {AUTH_TOKEN} = require('../../../Constants/Headers');

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

module.exports = async (ctx, next) => {
    const token = ctx.request.headers[AUTH_TOKEN];

    if (!token)
        throw new JsonError(AuthErrors.unauthorized);

    try {
        const session = jwt.verify(token, SECRET_KEY);
        ctx.state.session = session;
    } catch(error) {
        throw new JsonError(AuthErrors.unauthorized);
    }

    await next();
}
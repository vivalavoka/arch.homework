const JsonError = require('../../../Libs/JsonError');
const LockErrors = require('../../../Errors/LockErrors');
const {CORRELATION_ID} = require('../../../Constants/Headers');

module.exports = async (ctx, next) => {
    const correlation_id = ctx.request.headers[CORRELATION_ID];

    if (!correlation_id)
        throw new JsonError(LockErrors.correlation_not_found);

    ctx.state.correlation_id = correlation_id;
    await next();
}
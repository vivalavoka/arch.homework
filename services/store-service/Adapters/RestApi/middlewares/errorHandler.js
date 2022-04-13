module.exports = async function(ctx, next) {
    try {
        await next();
    } catch(error) {
        ctx.status = error.http_code || 500;
        ctx.type = 'application/json';
        ctx.body = { error: error.json || error.toString() }
    }
}

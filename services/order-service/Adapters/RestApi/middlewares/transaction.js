const PgTransaction = require('../../../Libs/PgTransaction');

module.exports = async (ctx, next) => {
    const transaction = await PgTransaction.init();
    const client = transaction.client;

    try {
        ctx.state.tx = transaction;
        await next();

        await transaction.commit();
    } catch (error) {
        await transaction.abort();
        throw error;
    }
}
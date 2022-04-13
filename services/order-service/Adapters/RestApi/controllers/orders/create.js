const JsonError = require('../../../../Libs/JsonError');
const OrdersErrors = require('../../../../Errors/OrdersErrors');
const OrderService = require('../../../../Services/OrderService');

module.exports = async (ctx) => {
    const {amount} = ctx.request.body;
    const {session, correlation_id, tx} = ctx.state;

    const {id, email} = session;

    const order = await OrderService.createOrder({ user_id: id, price: amount, email }, { correlation_id, tx });

    if (!order) {
        throw new JsonError(OrdersErrors.not_found);
    }

    ctx.body = {order};
}

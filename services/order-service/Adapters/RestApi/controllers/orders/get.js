const JsonError = require('../../../../Libs/JsonError');
const OrdersErrors = require('../../../../Errors/OrdersErrors');
const OrderService = require('../../../../Services/OrderService');

module.exports = async (ctx) => {
    const {session} = ctx.state;
    const {order_id} = ctx.request.params;

    const {id} = session;

    const order = await OrderService.getOrder({ order_id, user_id: id });

    if (!order) {
        throw new JsonError(OrdersErrors.not_found);
    }

    ctx.body = {order};
}

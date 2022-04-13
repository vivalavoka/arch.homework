const OrderService = require('../../../../Services/OrderService');

module.exports = async (ctx) => {
    const {session} = ctx.state;
    const {id} = session;

    const {orders} = await OrderService.getList({ user_id: id });

    ctx.body = {orders};
}

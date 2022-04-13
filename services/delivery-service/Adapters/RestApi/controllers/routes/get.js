const RouteService = require('../../../../Services/RouteService');

module.exports = async (ctx) => {
    const {order_id} = ctx.request.params;
    let route = await RouteService.getRoute({ order_id });

    ctx.body = {route};
}

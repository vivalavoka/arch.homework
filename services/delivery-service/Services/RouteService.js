const JsonError = require('../Libs/JsonError');
const RouteRepository = require('../Repositories/RouteRepository');

class RouteService {
    async createRoute({ order_id }, { tx }) {
        const routeRep = RouteRepository.get(tx.client);

        const route = await routeRep.onRoute({ order_id });

        return {data: route};
    }

    async getRoute({ order_id }) {
        const routeRep = RouteRepository.get();

        const route = await routeRep.getRoute({ order_id });
        return route;
    }

    async onRouteCommit(data, { tx }) {
        const { order_id } = data;
        const routeRep = RouteRepository.get(tx.client);

        await routeRep.delivered({ order_id });
    }

    async cancel(data, { tx }) {
        const { order_id } = data;
        const routeRep = RouteRepository.get(tx.client);

        await routeRep.cancel({ order_id });
    }
}

module.exports = new RouteService();

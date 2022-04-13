// Saga orchestrator
const rmq = require('../Adapters/Rmq');

const routeService = require('../Services/RouteService');
const PgTransaction = require('../Libs/PgTransaction');
const SagaTransactions = require('../Repositories/SagaTransactions');
const RmqPgCommand = require('./RmqPgCommand');
const SagaBuilder = require('./SagaBuilder');

const ACTIONS = {
    route: 'route',
};

class OrderSagaConsumer {
    async init() {
        this.sagaConsumer = SagaBuilder
            .create()
            .transaction(PgTransaction)
            .command(RmqPgCommand)
            .repository(SagaTransactions)
            .step(ACTIONS.route)
                .onStart(async (command) => {
                    const tx = command.tx;
                    const saga_key = command.saga_key;

                    const {data} = await routeService.createRoute({ order_id: saga_key }, {tx});
                    command.saga_data = data;
                })
                .onAccept(async (command) => {
                    const tx = command.tx;
                    const saga_key = command.saga_key;

                    await routeService.onRouteCommit({order_id: saga_key}, { tx });
                })
                .onReject(async (command) => {
                    const tx = command.tx;
                    const saga_data = command.saga_data;

                    await routeService.cancel(saga_data, {tx});
                })
            .build();

        await rmq.registerRPCServer('saga_exchange', 'delivery_service', (...args) => {
            return this.requestHandler(...args)
                .catch(console.error);
        });
    }


    async requestHandler(...args) {
        const command = await this.sagaConsumer(...args);
        return command.result;
    }
}

module.exports = new OrderSagaConsumer();

// Saga orchestrator
const rmq = require('../Adapters/Rmq');

const remnantService = require('../Services/RemnantService');
const PgTransaction = require('../Libs/PgTransaction');
const SagaTransactions = require('../Repositories/SagaTransactions');
const RmqPgCommand = require('./RmqPgCommand');
const SagaBuilder = require('./SagaBuilder');

const ACTIONS = {
    reserve: 'reserve',
};
class OrderSagaConsumer {
    async init() {
        this.sagaConsumer = SagaBuilder
            .create()
            .transaction(PgTransaction)
            .command(RmqPgCommand)
            .repository(SagaTransactions)
            .step(ACTIONS.reserve)
                .onStart(async (command) => {
                    const tx = command.tx;
                    const {amount} = command.data;

                    const {data} = await remnantService.reservePending({ amount }, {tx});
                    command.saga_data = data;
                })
                .onReject(async (command) => {
                    const tx = command.tx;
                    const saga_data = command.saga_data;

                    await remnantService.reserveReject(saga_data, {tx});
                })
            .build();

        await rmq.registerRPCServer('saga_exchange', 'store_service', (...args) => {
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

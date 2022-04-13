// Saga orchestrator
const rmq = require('../Adapters/Rmq');

const balanceService = require('../Services/BalanceService');
const PgTransaction = require('../Libs/PgTransaction');
const SagaTransactions = require('../Repositories/SagaTransactions');
const RmqPgCommand = require('./RmqPgCommand');
const SagaBuilder = require('./SagaBuilder');

const ACTIONS = {
    payment: 'payment',
};

class OrderSagaConsumer {
    async init() {
        this.sagaConsumer = SagaBuilder
            .create()
            .transaction(PgTransaction)
            .command(RmqPgCommand)
            .repository(SagaTransactions)
            .step(ACTIONS.payment)
                .onStart(async (command) => {
                    const tx = command.tx;
                    const {user_id, price} = command.data;

                    const {data} = await balanceService.payOutPending({user_id, amount: price }, {tx});
                    command.saga_data = data;
                })
                .onReject(async (command) => {
                    const tx = command.tx;
                    const saga_data = command.saga_data;

                    await balanceService.payOutReject(saga_data, {tx});
                })
            .build();

        await rmq.registerRPCServer('saga_exchange', 'billing_service', (...args) => {
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

// Saga orchestrator
const {v4: uuid} = require('uuid');
const rmq = require('../Adapters/Rmq');
const { TRANSACTION_ID } = require('../Constants/Headers');
const OrderStatuses = require('../Constants/OrderStatuses');
const PgTransaction = require('../Libs/PgTransaction');
const SagaTransactions = require('../Repositories/SagaTransactions');
const RmqPgCommand = require('./RmqPgCommand');
const SagaBuilder = require('./SagaBuilder');

const SERVICE_QUEUE = 'order_service';

const SAGA_STATUS = {
    success: 'success',
    failed: 'failed',
};

// TODO: разделить manager и sagaclient(с проброской orderService)
// Перенести инициализацию rmq в SagaClient
module.exports = class OrderSagaManager {
    constructor(OrderService) {
        this.OrderService = OrderService;
    }

    async init() {
        this.send = await rmq.registerSagaClient('saga_exchange', SERVICE_QUEUE);
        await rmq.registerConsumer('saga_exchange', SERVICE_QUEUE, (msg) => {
            msg.body = JSON.parse(msg.content.toString());
            return this.responseHandler(msg)
                .catch(console.error);
        });

        this.saga = SagaBuilder
            .create()
            .repository(SagaTransactions)
            .step('order')
                .onConfirm((command) => {
                    const tx = command.tx;
                    const saga_key = command.saga_key;

                    return this.OrderService.approveOrder({order_id: saga_key}, {tx});
                })
                // Компенсируемые транзакции, должны поддерживать откат
                .withCompensation((command) => {
                    const tx = command.tx;
                    const reason = command.reason;
                    const saga_key = command.saga_key;

                    return this.OrderService.rejectOrder({order_id: saga_key, reason}, {tx});
                })
            .step('payment')
                .invoke(async (command) => {
                    const data = command.data;
                    const saga_key = command.saga_key;
                    const transaction_id = command.transaction_id;

                    return this.send('billing_service', uuid(), {
                        saga_key,
                        action: 'payment_start',
                        data,
                    }, { [TRANSACTION_ID]: transaction_id });
                })
                .onConfirm((command) => {
                    const data = command.data || {};
                    const saga_key = command.saga_key;
                    const transaction_id = command.transaction_id;

                    return this.send('billing_service', uuid(), {
                        saga_key,
                        action: 'payment_accept',
                        data,
                    }, { [TRANSACTION_ID]: transaction_id });
                })
                .withCompensation(async (command) => {
                    const tx = command.tx;
                    const data = command.data;
                    const saga_key = command.saga_key;

                    await this.OrderService.paymentReject({order_id: saga_key}, {tx});
                    return this.send('billing_service', uuid(), {
                        saga_key,
                        action: 'payment_reject',
                        data,
                    });
                })
            .step('remnants')
                .invoke(async (command) => {
                    const tx = command.tx;
                    const saga_key = command.saga_key;
                    const transaction_id = command.transaction_id;

                    await this.OrderService.remnantPending({order_id: saga_key}, {tx});
                    return this.send('store_service', uuid(), {
                        saga_key,
                        action: 'reserve_start',
                        data: {amount: 1},
                    }, { [TRANSACTION_ID]: transaction_id });
                })
                // Повторяемые транзакции, завершение гарантировано
                .onConfirm((command) => {
                    const data = command.data || {};
                    const saga_key = command.saga_key;
                    const transaction_id = command.transaction_id;

                    return this.send('store_service', uuid(), {
                        saga_key,
                        action: 'reserve_accept',
                        data,
                    }, { [TRANSACTION_ID]: transaction_id });
                })
                .withCompensation(async (command) => {
                    const tx = command.tx;
                    const data = command.data;
                    const saga_key = command.saga_key;

                    await this.OrderService.remnantReject({order_id: saga_key}, {tx});
                    return this.send('store_service', uuid(), {
                        saga_key,
                        action: 'reserve_reject',
                        data,
                    });
                })
            // Поворотная транзакция, решающая транзакция саги, если успешно, повествование отрабатывает до конца
            .step('delivery')
                .invoke(async (command) => {
                    const tx = command.tx;
                    const data = command.data;
                    const saga_key = command.saga_key;
                    const transaction_id = command.transaction_id;

                    await this.OrderService.routePending({order_id: saga_key}, {tx});
                    return this.send('delivery_service', uuid(), {
                        saga_key,
                        action: 'route_start',
                        data,
                    }, { [TRANSACTION_ID]: transaction_id });
                })
            .build();

            console.log('this.saga: ', this.saga);
    }

    async responseHandler(message) {
        const command = new RmqPgCommand();
        const tx = await PgTransaction.init();

        try {
            const headers = message.properties.headers;
            const transaction_id = headers[TRANSACTION_ID];
            const body = message.body;

            command.tx = tx;
            command.transaction_id = transaction_id;
            command.status = body.status;
            command.saga_key = body.saga_key;

            await this.saga.response(command);
            await tx.commit();
        } catch(error) {
            console.log('error: ', error);
            await tx.abort();
        }
    }

    async start(order_id, data, {tx}) {
        const command = new RmqPgCommand();

        command.tx = tx;
        command.saga_key = order_id;
        command.data = data;

        return this.saga.next(command);
    }
}

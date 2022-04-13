// const {v4: uuid} = require('uuid');

const OrderRepository = require('../Repositories/OrderRepository');
const LockTableRepository = require('../Repositories/LockTableRepository');

const OrderSagaManager = require('../Saga/OrderSagaManager');
const OrderEventPublisher = require('../Publishers/OrderEventPublisher');

const OrderStatuses = require('../Constants/OrderStatuses');
const JsonError = require('../Libs/JsonError');
const OrdersErrors = require('../Errors/OrdersErrors');

class OrderService {
    async createOrder({ user_id, price, email }, { correlation_id, tx }) {
        // const lockRep = LockTableRepository.get(tx.client);
        const orderRep = OrderRepository.get(tx.client);

        // await lockRep.setLock({ key: correlation_id });
        const {order_id, status} = await orderRep.create({ user_id, price, status: OrderStatuses.payment_pending });

        const orderSagaClient = new OrderSagaManager(this);
        // order saga manager.create(order_id)
        await orderSagaClient.init();
        await orderSagaClient.start(order_id, {
            order_id,
            user_id,
            email,
            price,
        }, {tx});

        return {order_id, status};
    }

    async remnantPending({order_id}) {
        const orderRep = OrderRepository.get();
        const {status} = await orderRep.updateStatus({order_id, status: OrderStatuses.remnant_pending});
        return status;
    }

    async routePending({order_id}) {
        const orderRep = OrderRepository.get();
        const {status} = await orderRep.updateStatus({order_id, status: OrderStatuses.route_pending});
        return status;
    }

    async remnantReject({order_id}) {
        const orderRep = OrderRepository.get();
        const {status} = await orderRep.updateStatus({order_id, status: OrderStatuses.remnant_reject});
        return status;
    }

    async paymentReject({order_id}) {
        const orderRep = OrderRepository.get();
        const {status} = await orderRep.updateStatus({order_id, status: OrderStatuses.payment_reject});
        return status;
    }

    async approveOrder({order_id}) {
        const orderRep = OrderRepository.get();

        const order = await orderRep.get({order_id});
        const {status} = await orderRep.updateStatus({order_id, status: OrderStatuses.accepted});

        OrderEventPublisher.orderAccepted({order_id, id: order.user_id, email: order.email});
        return status;
    }

    async rejectOrder({order_id, reason}) {
        const orderRep = OrderRepository.get();

        const order = await orderRep.get({order_id});
        const {status} = await orderRep.updateStatus({order_id, status: OrderStatuses.rejected});

        OrderEventPublisher.orderRejected({id: order.user_id, email: order.email, order_id, reason});
        return status;
    }

    async sagaOrderInfo({order_id}, {tx}) {
        const orderRep = await OrderRepository.get(tx.client);
        const order = await orderRep.get({ order_id });
        return order;
    }

    async getOrder({order_id, user_id}) {
        const orderRep = await OrderRepository.get();
        const order = await orderRep.get({ order_id });
        if (order.user_id !== user_id) {
            throw new JsonError(OrdersErrors.not_found);
        }
        return order;
    }

    async getList({user_id}) {
        const orderRep = OrderRepository.get();

        const orders = await orderRep.list({ user_id });
        return {orders};
    }
}

module.exports = new OrderService();

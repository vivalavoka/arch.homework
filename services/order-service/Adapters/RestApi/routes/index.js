const Router = require('@koa/router');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');

const orders = require('./orders');

module.exports = app => {
    const router = new Router();

    router.get('/', (ctx) => {
        ctx.body = 'OK';
    });

    router.use(errorHandler);

    router.use('/orders', auth, orders.routes());

    app.use(router.routes());
}

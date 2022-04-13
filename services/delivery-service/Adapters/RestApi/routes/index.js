const Router = require('@koa/router');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');
const deliveryRoutes = require('./deliveryRoutes');

module.exports = app => {
    const router = new Router();

    router.get('/', (ctx) => {
        ctx.body = 'OK';
    });

    router.use(errorHandler);

    router.use('/routes', auth, deliveryRoutes.routes());

    app.use(router.routes())
}

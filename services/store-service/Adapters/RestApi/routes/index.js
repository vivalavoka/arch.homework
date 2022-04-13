const Router = require('@koa/router');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');
const remnants = require('./remnants');

module.exports = app => {
    const router = new Router();

    router.get('/', (ctx) => {
        ctx.body = 'OK';
    });

    router.use(errorHandler);

    router.use('/remnants', auth, remnants.routes());

    app.use(router.routes())
}

const Router = require('@koa/router');

const router = new Router();

router.get('/:order_id', require('../controllers/routes/get'));

module.exports = router;

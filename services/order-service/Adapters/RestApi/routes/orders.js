const Router = require('@koa/router');
const correlation = require('../middlewares/correlation');
const transaction = require('../middlewares/transaction');

const router = new Router();

router.get('/list', require('../controllers/orders/list'));
router.get('/:order_id', require('../controllers/orders/get'));

router.post('/', correlation, transaction, require('../controllers/orders/create'));

module.exports = router;

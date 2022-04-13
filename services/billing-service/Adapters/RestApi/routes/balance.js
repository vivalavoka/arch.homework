const Router = require('express-promise-router');
const correlation = require('../middlewares/correlation');

const router = new Router();

router.get('/', require('../controllers/balances/get'));

router.post('/pay-in', correlation, require('../controllers/balances/pay-in'));
router.post('/pay-out', correlation, require('../controllers/balances/pay-out'));

module.exports = router;

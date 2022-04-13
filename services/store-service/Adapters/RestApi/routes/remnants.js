const Router = require('@koa/router');

const router = new Router();

router.get('/', require('../controllers/remnants/get'));
router.put('/', require('../controllers/remnants/increase'));

module.exports = router;

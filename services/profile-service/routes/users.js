const Router = require('express-promise-router');

const router = new Router();

router.get('/', require('../controllers/users/get'));

router.put('/', require('../controllers/users/update'));

module.exports = router;

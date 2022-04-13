const Router = require('express-promise-router');

const router = new Router();

router.get('/', require('../controllers/messages/get'));

module.exports = router;

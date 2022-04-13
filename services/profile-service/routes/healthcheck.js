const Router = require('express-promise-router');
const db = require('../libs/db');

const router = new Router();

router.get('/', (request, response) => {
    response.json({ status: 'OK' });
});

module.exports = router;

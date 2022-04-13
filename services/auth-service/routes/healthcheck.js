const Router = require('express-promise-router');

const router = new Router();

router.get('/', (request, response) => {
    response.json({ status: 'OK' });
});

module.exports = router;

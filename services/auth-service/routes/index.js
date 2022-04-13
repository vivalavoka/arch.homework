const healthcheck = require('./healthcheck');

module.exports = app => {
    app.post('/sign-up', require('../controllers/auth/sign-up'));
    app.post('/login', require('../controllers/auth/login'));
    app.post('/logout', require('../controllers/auth/logout'));
    app.get('/check', require('../controllers/auth/check'));

    app.use('/health', healthcheck);
}

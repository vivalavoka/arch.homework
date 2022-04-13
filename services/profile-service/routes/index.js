const user = require('./users');
const healthcheck = require('./healthcheck');

const auth = require('../middlewares/auth');

module.exports = app => {
    app.use('/user', auth, user);
    app.use('/health', healthcheck);
}

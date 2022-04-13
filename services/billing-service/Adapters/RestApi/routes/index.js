const auth = require('../middlewares/auth');
const balance = require('./balance');

module.exports = app => {
    app.get('/', (request, response) => {
        response.send('OK');
    });

    app.use('/balance', auth, balance);
}

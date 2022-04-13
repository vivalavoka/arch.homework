const auth = require('../middlewares/auth');
const message = require('./message');

module.exports = app => {
    app.get('/', (request, response) => {
        response.send('OK');
    });

    app.use('/message', auth, message);
}

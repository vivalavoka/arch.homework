const promBundle = require('express-prom-bundle');

module.exports = promBundle({
    includeMethod: true, 
    includePath: true, 
    includeStatusCode: true, 
});
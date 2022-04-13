const RemnantService = require('./Services/RemnantService');

module.exports = async () => {
    await RemnantService.createRemnant({ value: 0 });
}

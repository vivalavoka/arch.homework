const RemnantService = require('../../../../Services/RemnantService');

module.exports = async (ctx) => {
    let remnants = await RemnantService.getRemnants();

    if (!remnants) {
        await RemnantService.createRemnant();
        remnants = await RemnantService.getRemnants();
    }

    ctx.body = {remnants};
}

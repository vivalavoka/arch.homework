const RemnantService = require('../../../../Services/RemnantService');

module.exports = async (ctx) => {
    const {amount} = ctx.request.body;

    const remnants = await RemnantService.increase({ value: amount });
    ctx.body = {remnants};
}

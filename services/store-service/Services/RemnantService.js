const JsonError = require('../Libs/JsonError');
const RemnantRepository = require('../Repositories/RemnantRepository');
const RemnantsErrors = require('../Errors/RemnantsErrors');

class RemnantService {
    async createRemnant({ value }) {
        const remnantRep = RemnantRepository.get();
        return remnantRep.create({ value });
    }

    async getRemnants() {
        const remnantRep = RemnantRepository.get();

        const { value } = await remnantRep.getRemnants();
        return { value };
    }

    async increase({ value }) {
        const remnantRep = RemnantRepository.get();

        const data = await remnantRep.increase({ value });
        return data;
    }

    async reservePending(data, { tx }) {
        const { amount } = data;
        const remnantRep = RemnantRepository.get(tx.client);

        const remnants = await remnantRep.getRemnants();
        
        if (remnants.value - amount < 0) {
            throw new JsonError(RemnantsErrors.not_enough_remnants);
        }

        await remnantRep.decrease({ value: amount });

        return { data: { amount } };
    }

    async reserveReject(data, { tx }) {
        const { amount } = data;
        const remnantRep = RemnantRepository.get(tx.client);

        await remnantRep.increase({ value: amount });
    }
}

module.exports = new RemnantService();

const JsonError = require('../Libs/JsonError');
const BalanceRepository = require('../Repositories/BalanceRepository');
const LockTableRepository = require('../Repositories/LockTableRepository');
const BalanceErrors = require('../Errors/BalanceErrors');

class BalanceService {
    async createBalance({ user_id }) {
        const balanceRep = BalanceRepository.get();

        return balanceRep.create({ user_id, value: 0 })
            .catch((error) => {
                if (error.code !== '23505') {
                    throw error;
                }
            });
    }

    async getBalance({ user_id }) {
        const balanceRep = BalanceRepository.get();

        const balance = await balanceRep.getBalance({ user_id });
        return { balance };
    }

    async payIn({ user_id, amount }, { correlation_id, tx }) {
        const lockRep = LockTableRepository.get(tx.client);
        const balanceRep = BalanceRepository.get(tx.client);

        await lockRep.setLock({key: correlation_id });
        const curBalance = await balanceRep.payIn({ user_id, value: amount });
        return { balance: curBalance }
    }

    async payOutPending({ user_id, amount }, {tx}) {
        const balanceRep = BalanceRepository.get(tx.client);

        const balance = await balanceRep.getBalance({ user_id });
        if (balance.value - amount < 0) {
            throw new JsonError(BalanceErrors.not_enough_funds);
        }

        await balanceRep.payOut({user_id, value: amount});

        return {data: {user_id, amount}};
    }

    async payOutReject({ user_id, amount }, {tx}) {
        const balanceRep = BalanceRepository.get(tx.client);

        await balanceRep.payIn({user_id, value: amount});
    }
}

module.exports = new BalanceService();

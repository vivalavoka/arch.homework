const BalanceService = require('../../../../Services/BalanceService');
const PgTransaction = require('../../../../Libs/PgTransaction');

module.exports = async (req, res) => {
    const {amount} = req.body;
    const {session, correlation_id} = req.state;

    const {id} = session;

    const tx = await PgTransaction.init();

    try {
        const {balance} = await BalanceService.payIn({ user_id: id, amount }, { correlation_id, tx });

        if (!balance) {
            return res.status(400).send('Not Found');
        }

        await tx.commit();
        res.send(balance);
    } catch(error) {
        await tx.abort();
        res.status(error.httpCode || 400).json(error.json);
    }
}

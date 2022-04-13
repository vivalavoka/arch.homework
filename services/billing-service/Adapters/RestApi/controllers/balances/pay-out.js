const BalanceService = require('../../../../Services/BalanceService');

module.exports = async (req, res) => {
    const {amount} = req.body;
    const {session, correlation_id} = req.state;

    const {id} = session;

    try {
        const {balance} = await BalanceService.payOut({ user_id: id, amount }, { correlation_id });

        if (!balance) {
            return res.status(400).send('Not Found');
        }
        res.send(balance);
    } catch(error) {
        res.status(error.httpCode || 400).json(error.json);
    }
}

const BalanceService = require('../../../../Services/BalanceService');

module.exports = async (req, res) => {
    const {session} = req.state;
    const {id} = session;

    const {balance} = await BalanceService.getBalance({ user_id: id });

    if (!balance) {
        return res.status(400).send('Not Found');
    }
    res.send(balance);
}

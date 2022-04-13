module.exports = {
    pending: 'pending', // ожидание транзакции
    processed: 'processed', // транзакция обработана, но еще не зафиксирована
    confirmed: 'confirmed', // транзакция подтверждена
    rejected: 'rejected', // транзакция отклонена
};

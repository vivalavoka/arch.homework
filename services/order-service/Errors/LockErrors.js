module.exports = {
    correlation_not_found: {
        http_code: 400,
        code: 'correlation_not_found',
        message: 'Ключ корелляции не найден'
    },
    locked: {
        http_code: 409,
        code: 'locked',
        message: 'Запрос уже обработан'
    }
}
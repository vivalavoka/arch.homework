const {v4: uuidv4} = require('uuid');

const storage = {};

module.exports = {
    get: (sessionId) => {
        return storage[sessionId] || null;
    },
    create: (payload) => {
        const sessionId = uuidv4();
        storage[sessionId] = payload;
        return sessionId;
    },
    drop: (sessionId) => {
        delete storage[sessionId];
    },
}
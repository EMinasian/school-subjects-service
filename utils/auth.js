const { sign } = require('jsonwebtoken');
const KEY = 'someSecretKey'

const createJSONToken = (email) => {
    return sign({ email }, KEY, { expiresIn: '1h' });
}

module.exports = { createJSONToken }
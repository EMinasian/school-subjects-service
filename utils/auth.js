const { sign } = require('jsonwebtoken');
const { compare } = require('bcryptjs');
const KEY = 'someSecretKey'

const createJSONToken = (email) => {
    return sign({ email }, KEY, { expiresIn: '1h' });
}

const isValidPassword = (password, storedPassword) => {
    return compare(password, storedPassword);
  }

module.exports = { createJSONToken, isValidPassword }
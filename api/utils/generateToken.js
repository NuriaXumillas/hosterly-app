// api/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en .env');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = generateToken; 
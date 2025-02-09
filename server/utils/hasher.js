const crypto = require('crypto')

export const generateSalt = () => crypto.randomBytes(16).toString('hex');

export const hashPassword = (password, salt) => {
    return crypto.scryptSync(password, salt, 64).toString('hex');
};
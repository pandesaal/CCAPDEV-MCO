import { randomBytes, scryptSync } from 'node:crypto';

export const generateSalt = () => randomBytes(16).toString('hex');

export const hashPassword = (password, salt) => {
    return scryptSync(password, salt, 64).toString('hex');
};
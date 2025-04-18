import crypto from 'crypto';

export const emailVerifyCodesByUserId = {};

export function generateSecureCode(email) {
    delete emailVerifyCodesByUserId[email];
    const buffer = crypto.randomBytes(3);
    const hex = buffer.toString('hex');
    const numeric = parseInt(hex, 16).toString().slice(0, 6);
    const uniqueCode = numeric.padStart(6, '0');

    const expiresAt = Date.now() + 5 * 60 * 1000;
    emailVerifyCodesByUserId[email] = { code: uniqueCode, expiresAt };
    return uniqueCode;
}

export function verifyCode(code, email) {
    const record = emailVerifyCodesByUserId[email];
    if (!record || record.code !== code || Date.now() > record.expiresAt) {
        return false;
    }
    delete emailVerifyCodesByUserId[email];
    return true;
}
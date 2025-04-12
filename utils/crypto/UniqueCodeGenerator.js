import crypto from 'crypto';

let emailVerifyCodesByUserId = {};

export function generateSecureCode(email) {
    const buffer = crypto.randomBytes(3);
    const hex = buffer.toString('hex');
    const numeric = parseInt(hex, 16).toString().slice(0, 6);
    const uniqueCode = numeric.padStart(6, '0');
    emailVerifyCodesByUserId[email] = uniqueCode;
    return uniqueCode;
}

export function verifyCode(code, email) {
    if (emailVerifyCodesByUserId[email] !== code) {
        console.log(code, emailVerifyCodesByUserId[email], email);
        return false;
    }
    emailVerifyCodesByUserId[email].delete;
    return true;
}
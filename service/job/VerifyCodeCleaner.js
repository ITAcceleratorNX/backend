import { emailVerifyCodesByUserId } from "../../utils/crypto/UniqueCodeGenerator.js";

export function cleanExpiredCodes() {
    const now = Date.now();
    for (const email in emailVerifyCodesByUserId) {
        if (emailVerifyCodesByUserId[email].expiresAt < now) {
            delete emailVerifyCodesByUserId[email];
        }
    }
}

if (process.env.NODE_ENV !== 'test') {
    setInterval(cleanExpiredCodes, 60 * 1000);
}
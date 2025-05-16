import { emailVerifyCodesByUserId } from "../../../main/utils/crypto/UniqueCodeGenerator.js";
import "../../../main/service/job/VerifyCodeCleaner.js";
import {cleanExpiredCodes} from "../../../main/service/job/VerifyCodeCleaner.js";

describe('cleanExpiredCodes()', () => {
    beforeEach(() => {
        for (const key in emailVerifyCodesByUserId) {
            delete emailVerifyCodesByUserId[key];
        }
    });

    it('Clear expired unique codes', () => {
        const now = Date.now();
        emailVerifyCodesByUserId['expired@example.com'] = {
            code: '111111',
            expiresAt: now - 1000,
        };
        emailVerifyCodesByUserId['valid@example.com'] = {
            code: '222222',
            expiresAt: now + 60000,
        };

        cleanExpiredCodes();

        expect(emailVerifyCodesByUserId['expired@example.com']).toBeUndefined();
        expect(emailVerifyCodesByUserId['valid@example.com']).toBeDefined();
    });
});


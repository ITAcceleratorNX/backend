import crypto from 'crypto';

const PAYMENT_SECRET_KEY = process.env.PAYMENT_SECRET_KEY;

export function verifyPaymentSign(req, res, next) {
    try {
        const { data, sign } = req.body;

        if (!data || !sign) {
            return res.status(400).json({ message: "Missing 'data' or 'sign'" });
        }

        const expectedSign = crypto
            .createHmac('sha512', PAYMENT_SECRET_KEY)
            .update(data)
            .digest('hex');

        if (expectedSign !== sign) {
            return res.status(401).json({ message: 'Invalid signature' });
        }

        next();
    } catch (err) {
        console.error('Signature verification error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
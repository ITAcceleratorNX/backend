import {Buffer} from "buffer";
import logger from "../utils/winston/logger.js";

export const base64Decoder = (req, res, next) => {
    try {
        const decoded = JSON.parse(Buffer.from(req.body.data, 'base64').toString('utf-8'));
        logger.info('Decoded payment callback', decoded);
        req.body = decoded;
        next();
    } catch (error) {
        logger.error('Failed to decode payment callback', { error: error.message });

        return res.status(400).json({
            error: 'Invalid base64 or JSON payload',
            details: error?.errors?.map((e) => ({
                field: e.path?.join('.') ?? 'unknown',
                message: e.message,
            })) ?? [{ field: 'data', message: error.message }],
        });
    }
};
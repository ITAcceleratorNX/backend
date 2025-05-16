import logger from '../utils/winston/logger.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
    logger.error(`[${req.method}] ${req.url} - ${err.message}: stack: ${err.stack}`);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        error: message,
    });
}

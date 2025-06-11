import logger from '../utils/winston/logger.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
    logger.error('Error occurred', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl || req.url,
        userId: req.user?.id || null,
        endpoint: req.originalUrl || req.url,
        requestId: req.id || null,
    });

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.error(err);
    res.status(status).json({
        error: message,
    });
}

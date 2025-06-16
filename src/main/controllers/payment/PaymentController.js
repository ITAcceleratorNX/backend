import logger from "../../utils/winston/logger.js";
import * as paymentService from "../../service/payment/PaymentService.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

export const createPayment = asyncHandler(async (req, res) => {
    const response = await paymentService.create(req.body, req.user.id);
    res.status(201).json(response);
});

export const getMyPayments = asyncHandler(async (req, res) => {
    const id = Number(req.user.id);
    const order_payments = await paymentService.getByUserId(id);
    logger.info('Fetched user order payments', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        message: `Fetched user order payments`,
    });
    res.json(order_payments);
});

export const getUserPayments = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        logger.warn('Invalid ID received', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
            idParam: req.params.id
        });
        return res.status(400).json({ error: 'Invalid ID', details: [{message: "Invalid ID"}] });
    }

    const result = await paymentService.getByUserId(id);
    if (!result) {
        logger.info('Resource not found', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
            resourceId: id
        });
        return res.status(200).json({ error: 'Not found' });
    }

    logger.info('Fetched resource', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        requestId: req.id,
        resourceId: id
    });
    res.json(result);
});

export const manualPayment = async (req, res) => {
    const response = await paymentService.createManual(req.body, req.user.id);
    res.status(200).json(response);
}
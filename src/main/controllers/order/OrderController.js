import * as orderService from "../../service/order/OrderService.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";
import {createBaseController} from "../base/BaseController.js";
import logger from "../../utils/winston/logger.js";
import {
    createContract,
    revokeContract,
    updateContract
} from "../../service/contract/contract.service.js";

const base = createBaseController(orderService);

export const getAllOrders = base.getAll;

export const getMyOrders = asyncHandler(async (req, res) => {
    const id = Number(req.user.id);
    const orders = await orderService.getByUserId(id);
    logger.info('Fetched user orders', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        requestId: req.id,
        orderCount: orders.length
    });
    res.json(orders);
});

export const getOrderById = base.getById;

export const createOrder = asyncHandler(async (req, res) => {
    const new_order = await orderService.createOrder(req);
    logger.info('Created order', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        requestId: req.id,
        orderId: new_order?.id
    });
    res.status(201).json({new_order});
});

export const updateOrder = base.update;
export const deleteOrder = base.delete;

export const approveOrder = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        logger.warn('Invalid ID received', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
            idParam: req.params.id
        });
        return res.status(400).json({error: 'Invalid order ID'});
    }
    const response = await orderService.approveOrder(id, req.body);
    logger.info('Updated order status', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        response: response
    });
    await createContract(id)
    return res.status(200).json({response});
});

export const cancelOrder = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await orderService.cancelOrder(id, req.user.id);
    await revokeContract(id)
    return res.sendStatus(204).end();
})

export const getMyContracts = asyncHandler(async (req, res) => {
    const contracts = await orderService.getMyContracts(req.user.id);
    res.json(contracts);
});
export const updateMyContracts = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const response = await updateContract(req.body, id);
    return res.status(200).json({ response });
});

//
// export const extendOrder = asyncHandler(async (req, res) => {
//     const response = await orderService.extendOrder(req.body, req.user.id);
//     logger.info(`Extending order`)
//     return res.status(200).json({response});
// });
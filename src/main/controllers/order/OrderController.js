import * as orderService from "../../service/order/OrderService.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";
import {createBaseController} from "../base/BaseController.js";
import logger from "../../utils/winston/logger.js";


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

export const cancelOrder = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await orderService.cancelOrder(id, req.user.id,req.body.document_id);
    return res.sendStatus(204).end();
})

export const getMyContracts = asyncHandler(async (req, res) => {
    const contracts = await orderService.getMyContracts(req.user.id);
    res.json(contracts);
});
export const getItemsByOrderId = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const items = await orderService.getItemsByOrderId(id);
    res.json(items);
})

export const extendOrder = asyncHandler(async (req, res) => {
    const response = await orderService.extendOrder(req.body, req.user.id);
    logger.info(`Extending order`)
    return res.status(200).json({response});
});
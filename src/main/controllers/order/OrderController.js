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

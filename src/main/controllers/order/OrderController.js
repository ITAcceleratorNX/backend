import * as orderService from "../../service/order/OrderService.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";
import {createBaseController} from "../base/BaseController.js";

const base = createBaseController(orderService);

export const getAllOrders = base.getAll;

export const getMyOrders = asyncHandler(async (req, res) => {
    const id = Number(req.user.id);
    const result = await orderService.getByUserId(id);
    if (!result) return res.status(404).json({ error: 'Not found' });

    res.json(result);
});

export const getOrderById = base.getById;

export const createOrder = asyncHandler(async (req, res) => {
    const new_order = await orderService.createOrder(req);
    res.status(201).json({new_order});
});

export const updateOrder = base.update;

export const deleteOrder = base.delete;

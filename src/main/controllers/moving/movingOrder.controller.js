import * as orderService from '../../service/moving/movingOrder.service.js';
import {getDeliveredOrdersPaginated} from "../../service/moving/movingOrder.service.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export const getOrderById = asyncHandler(async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export const getOrderByStatus = asyncHandler(async (req, res) => {
    try {
        const order = await orderService.getOrdersByStatus(req.params.status);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export const getDeliveredOrders = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await getDeliveredOrdersPaginated(page, limit);

        res.json(result);
    } catch (error) {
        console.error('Error in getDeliveredOrders:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
export const updateOrder = asyncHandler(async (req, res) => {
    try {
        const order = await orderService.updateOrder(req.params.id, req.body);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export const deleteOrder = asyncHandler(async (req, res) => {
    try {
        const deleted = await orderService.deleteOrder(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export const getMyMovings = asyncHandler(async (req, res) => {
    const response = await orderService.getMyMovings(req.user.id);
    return res.status(200).json(response);
})

import * as CloudStorageOrderService from "../service/СloudStorageOrderService.js";

export const createOrder = async (req, res) => {
    try {
        const order = await CloudStorageOrderService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await CloudStorageOrderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await CloudStorageOrderService.getOrderById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const updated = await CloudStorageOrderService.updateOrder(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        await CloudStorageOrderService.deleteOrder(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

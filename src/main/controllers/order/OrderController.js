import * as orderService from "../../service/order/OrderService.js";
import * as orderCellService from "../../service/order/OrderCellService.js";
import {sequelize} from "../../config/database.js";
import * as storageService from "../../service/storage/StorageService.js";
import * as storageCellsService from "../../service/storage/StorageCellsService.js";
import logger from "../../utils/winston/logger.js";
import * as priceService from "../../service/price/PriceService.js";
import {calculateDayRemainder, calculateMonthDiff} from "../../utils/date/DateCalculator.js";

export const getAllOrders = async (req, res) => {
    try {
        const result = await orderService.getAll();
        return res.json(result);
    } catch (err) {
        console.error('Get all orders error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const id = Number(req.user.id);

        const result = await orderService.getByUserId(id);
        if (!result) return res.status(404).json({ error: 'Not found' });

        return res.json(result);
    } catch (err) {
        console.error('Get my orders error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const result = await orderService.getById(id);
        if (!result) return res.status(404).json({ error: 'Not found' });

        return res.json(result);
    } catch (err) {
        console.error('Get order by ID error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { cell_ids, ...data } = req.body;

        const foundCells = await storageCellsService.findAll({
            where: {
                id: cell_ids
            }
        });

        if (foundCells.length !== cell_ids.length) {
            const foundIds = foundCells.map(c => c.id);
            const missingIds = cell_ids.filter(id => !foundIds.includes(id));
            return res.status(404).json({
                error: 'Some storage cells were not found',
                missing_cell_ids: missingIds
            });
        }

        const occupiedCells = foundCells.filter(c => c.is_occupied);
        if (occupiedCells.length > 0) {
            return res.status(400).json({
                error: 'Some storage cells are already occupied',
                occupied_cell_ids: occupiedCells.map(c => c.id)
            });
        }

        const total_volume = cell_ids.length;

        const storage = await storageService.getById(data.storage_id);
        if (!storage) {
            return res.status(404).json({ error: 'Storage not found' });
        }

        const calculateDto = {
            type: storage.storage_type,
            area: total_volume,
            month: calculateMonthDiff(data.start_date, data.end_date),
            day: calculateDayRemainder(data.start_date, data.end_date)
        };

        const total_price = await priceService.calculate(calculateDto, res);
        console.log("total_price",total_price);
        if (!total_price) {
            return;
        }

        const orderData = {
            ...data,
            user_id: req.user.id,
            total_volume,
            total_price,
            created_at: Date.now(),
        };

        await sequelize.transaction(async (t) => {
            const newOrder = await orderService.create(orderData, { transaction: t });

            if (Array.isArray(cell_ids) && cell_ids.length > 0) {
                const cells = cell_ids.map((cell_id) => ({
                    order_id: newOrder.id,
                    cell_id
                }));

                await storageCellsService.updateStorageCells(cell_ids, { is_occupied: true }, { transaction: t });
                await orderCellService.createOrderCells(cells, { transaction: t });
            }

            return res.status(201).json({ new_order: newOrder });
        });
    } catch (error) {
        logger.error("Create order error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const [updatedCount] = await orderService.update(id, req.body);
        if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ updated: updatedCount });
    } catch (err) {
        console.error('Update order error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const deletedCount = await storageService.deleteById(id);
        if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ deleted: deletedCount });
    } catch (err) {
        console.error('Delete order error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

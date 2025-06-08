import * as orderService from "../../service/order/OrderService.js";
import * as orderCellService from "../../service/order/OrderCellService.js";
import {sequelize} from "../../config/database.js";
import * as storageService from "../../service/storage/StorageService.js";
import * as storageCellsService from "../../service/storage/StorageCellsService.js";
import * as priceService from "../../service/price/PriceService.js";
import {calculateDayRemainder, calculateMonthDiff} from "../../utils/date/DateCalculator.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

export const getAllOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getAll();
    res.json(result);
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const id = Number(req.user.id);
    const result = await orderService.getByUserId(id);
    if (!result) return res.status(404).json({ error: 'Not found' });

    res.json(result);
});

export const getOrderById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const result = await orderService.getById(id);
    if (!result) return res.status(404).json({ error: 'Not found' });

    res.json(result);
});

export const createOrder = asyncHandler(async (req, res) => {
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
    if (!total_price) return;

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

        res.status(201).json({ new_order: newOrder });
    });
});

export const updateOrder = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const [updatedCount] = await orderService.update(id, req.body);
    if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ updated: updatedCount });
});

export const deleteOrder = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const deletedCount = await storageService.deleteById(id);
    if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ deleted: deletedCount });
});

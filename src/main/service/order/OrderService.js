import {Order, StorageCells} from "../../models/init/index.js";
import * as storageCellsService from "../storage/StorageCellsService.js";
import * as storageService from "../storage/StorageService.js";
import {calculateDayRemainder, calculateMonthDiff} from "../../utils/date/DateCalculator.js";
import * as priceService from "../price/PriceService.js";
import {sequelize} from "../../config/database.js";
import * as orderCellService from "./OrderCellService.js";

export const getAll = async () => {
    return Order.findAll({
        include: [
            {
                model: StorageCells,
                include: [
                    {
                        association: 'storage'
                    }
                ],
                through: { attributes: [] },
            }
        ]
    });
};

export const getById = async (id) => {
    return Order.findByPk(id, {
        include: [
            {
                model: StorageCells,
                include: [
                    {
                        association: 'storage'
                    }
                ],
                through: { attributes: [] },
            }
        ]
    });
};

export const getByUserId = async (userId) => {
    const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
            {
                model: StorageCells,
                include: [
                    {
                        association: 'storage'
                    }
                ],
                through: { attributes: [] },
            }
        ]
    });
    if (!orders) {
        const error = new Error('Not Found');
        error.status = 404;
        throw error;
    }
    return orders;
};

export const create = async (data, options) => {
    return Order.create(data, options);
};

export const update = async (id, data) => {
    return Order.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return Order.destroy({ where: { id: id } });
};

export const createOrder = async (req) => {
    const { cell_ids, ...data } = req.body;

    const foundCells = await storageCellsService.findAll({
        where: {
            id: cell_ids
        }
    });

    if (foundCells.length !== cell_ids.length) {
        const foundIds = foundCells.map(c => c.id);
        const missingIds = cell_ids.filter(id => !foundIds.includes(id));
        const error = new Error('Some storage cells were not found');
        error.status = 404;
        error.missing_cell_ids = missingIds;
        throw error;
    }

    const occupiedCells = foundCells.filter(c => c.is_occupied);
    if (occupiedCells.length > 0) {
        const error = new Error('Some storage cells are already occupied');
        error.status = 400;
        error.occupied_cell_ids = occupiedCells.map(c => c.id);
        throw error;
    }

    const total_volume = cell_ids.length;

    const storage = await storageService.getById(data.storage_id);
    if (!storage) {
        const error = new Error('Storage not found');
        error.status = 404;
        throw error;
    }

    const calculateDto = {
        type: storage.storage_type,
        area: total_volume,
        month: calculateMonthDiff(data.start_date, data.end_date),
        day: calculateDayRemainder(data.start_date, data.end_date)
    };

    const total_price = await priceService.calculate(calculateDto);
    if (!total_price) {
        const error = new Error('Failed to calculate price');
        error.status = 500;
        throw error;
    }

    const orderData = {
        ...data,
        user_id: req.user.id,
        total_volume,
        total_price,
        created_at: Date.now(),
    };

    await sequelize.transaction(async (t) => {
        const newOrder = await create(orderData, { transaction: t });

        if (Array.isArray(cell_ids) && cell_ids.length > 0) {
            const cells = cell_ids.map((cell_id) => ({
                order_id: newOrder.id,
                cell_id
            }));

            await storageCellsService.updateStorageCells(cell_ids, { is_occupied: true }, { transaction: t });
            await orderCellService.createOrderCells(cells, { transaction: t });
        }

        return newOrder;
    });
}
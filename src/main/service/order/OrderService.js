import {Order} from "../../models/init/index.js";
import * as storageService from "../storage/StorageService.js";
import {calculateDayRemainder, calculateMonthDiff} from "../../utils/date/DateCalculator.js";
import * as priceService from "../price/PriceService.js";

export const getAll = async () => {
    return Order.findAll({
        include: [
            {
                association: 'storage'
            }
        ]
    });
};

export const getById = async (id) => {
    return Order.findByPk(id, {
        include: [
            {
                association: 'storage'
            }
        ]
    });
};

export const getByUserId = async (userId) => {
    const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
            {
                association: 'storage'
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

export const create = async (data, options = {}) => {
    return Order.create(data, options);
};

export const update = async (id, data) => {
    return Order.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return Order.destroy({ where: { id: id } });
};

export const createOrder = async (req) => {
    const storage = await storageService.getById(req.body.storage_id);
    if (!storage) {
        const error = new Error('Storage not found');
        error.status = 404;
        throw error;
    }

    const calculateDto = {
        type: storage.storage_type,
        area: req.body.total_volume,
        month: calculateMonthDiff(req.body.start_date, req.body.end_date),
        day: calculateDayRemainder(req.body.start_date, req.body.end_date)
    };

    const total_price = await priceService.calculate(calculateDto);
    if (!total_price) {
        const error = new Error('Failed to calculate serivce');
        error.status = 500;
        throw error;
    }

    const orderData = {
        ...req.body,
        user_id: req.user.id,
        total_price,
        created_at: Date.now(),
    };

    return await create(orderData);
}
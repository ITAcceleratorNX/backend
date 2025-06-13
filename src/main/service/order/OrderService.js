import {Order, Storage} from "../../models/init/index.js";
import * as priceService from "../price/PriceService.js";
import {sequelize} from "../../config/database.js";
import {DateTime} from 'luxon';
import * as storageService from "../storage/StorageService.js";
import logger from "../../utils/winston/logger.js";

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
    const transaction = await sequelize.transaction();
    try {
        const order = await getById(id);
        if (!order) {
            throw Object.assign(new Error('Not found'), { status: 400 });
        }
        let newVolume = Number(order.storage.available_volume) + Number(order.total_volume);
        await storageService.update(order.storage_id, {
            status: 'VACANT',
            available_volume: newVolume
        }, transaction);
        await Order.destroy({ where: { id: id }, transaction });
        await transaction.commit();
        return {success: true};
    } catch (err) {
        await transaction.rollback()
        logger.error(err);
        throw err;
    }
};

export const createOrder = async (req) => {
    const transaction = await sequelize.transaction();
    try {
        const storage = await Storage.findByPk(req.body.storage_id, { transaction });
        if (!storage) {
            throw Object.assign(new Error('storage not found'), { status: 200 });
        } else if(storage.status === 'OCCUPIED' || storage.status === 'PENDING') {
            throw Object.assign(new Error('unable to select this storage'), { status: 200 });
        } else if(storage.available_volume < req.body.total_volume) {
            throw Object.assign(new Error('storage unavailable'), { status: 200 });
        }

        const start = DateTime.now();
        const monthCount = req.body.months;
        const end = start.plus({ months: monthCount });

        const calculateDto = {
            type: storage.storage_type,
            area: req.body.total_volume,
            month: monthCount
        };

        const total_price = await priceService.calculate(calculateDto);
        if (!total_price) {
            throw Object.assign(new Error('Failed to calculate service'), { status: 500 });
        }

        const deposit = await priceService.getByType('DEPOSIT');

        const orderData = {
            ...req.body,
            user_id: req.user.id,
            start_date: start.toJSDate(),
            end_date: end.toJSDate(),
            total_price: total_price + Number(deposit.price),
            created_at: new Date(),
        };

        const order = await Order.create(orderData, { transaction });

        let newVolume = storage.available_volume;
        if(storage.storage_type !== 'INDIVIDUAL') {
            newVolume = storage.available_volume - req.body.total_volume;
        }
        const updatedStorageData = {
            available_volume: newVolume,
            status: 'PENDING',
        };

        await Storage.update(updatedStorageData, {
            where: { id: storage.id },
            transaction,
        });

        await transaction.commit();
        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
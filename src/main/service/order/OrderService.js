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
        const { storage_id, total_volume, months } = req.body;
        const { id: user_id } = req.user;

        const storage = await Storage.findByPk(storage_id, { transaction });
        validateStorage(storage, total_volume);

        const { start_date, end_date } = calculateDates(months);
        const total_price = await calculateTotalPrice(storage.storage_type, total_volume, months);
        const deposit = await priceService.getByType('DEPOSIT');

        const orderData = {
            ...req.body,
            user_id,
            start_date,
            end_date,
            total_price: total_price + Number(deposit.price),
            created_at: new Date(),
        };

        const order = await Order.create(orderData, { transaction });

        await updateStorageVolume(storage, total_volume, transaction);

        await transaction.commit();
        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

function validateStorage(storage, total_volume) {
    if (!storage) {
        throw Object.assign(new Error('storage not found'), { status: 200 });
    }
    if (['OCCUPIED', 'PENDING'].includes(storage.status)) {
        throw Object.assign(new Error('unable to select this storage'), { status: 200 });
    }
    if (storage.available_volume < total_volume) {
        throw Object.assign(new Error('storage unavailable'), { status: 200 });
    }
}

function calculateDates(months) {
    const start = DateTime.now();
    const end = start.plus({ months });
    return {
        start_date: start.toJSDate(),
        end_date: end.toJSDate(),
    };
}

async function calculateTotalPrice(type, area, month) {
    const calculateDto = { type, area, month };
    const price = await priceService.calculate(calculateDto);
    if (!price) {
        throw Object.assign(new Error('Failed to calculate service'), { status: 500 });
    }
    return price;
}

async function updateStorageVolume(storage, total_volume, transaction) {
    const isIndividual = storage.storage_type === 'INDIVIDUAL';
    const newVolume = isIndividual ? storage.available_volume : storage.available_volume - total_volume;

    await Storage.update(
        {
            available_volume: newVolume,
            status: 'PENDING',
        },
        {
            where: { id: storage.id },
            transaction,
        }
    );
}
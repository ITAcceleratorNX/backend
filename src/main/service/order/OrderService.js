import {Order, OrderItem, OrderPayment, Storage} from "../../models/init/index.js";
import * as priceService from "../price/PriceService.js";
import {sequelize} from "../../config/database.js";
import {DateTime} from 'luxon';
import * as storageService from "../storage/StorageService.js";
import logger from "../../utils/winston/logger.js";
import {Op} from "sequelize";
import {NotificationService} from "../notification/notification.service.js";

const notificationService = new NotificationService();

export const getAll = async () => {
    return Order.findAll({
        include: [
            {
                association: 'storage'
            },
            {
                association: 'items'
            }
        ]
    });
};

export const getById = async (id) => {
    return Order.findByPk(id, {
        include: [
            {
                association: 'storage'
            },
            {
                association: 'items'
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
            },
            {
                association: 'items'
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
        let newVolume = Number(order.available_volume) + (Number(order.total_volume) - Number(order.storage.available_volume));
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
        const { storage_id, order_items, months } = req.body;
        const { id: user_id } = req.user;

        const storage = await Storage.findByPk(storage_id, { transaction });
        const total_volume = getTotalVolumeFromItems(order_items);
        validateStorage(storage, total_volume);

        const { start_date, end_date } = calculateDates(months);
        const total_price = await calculateTotalPrice(
            storage.storage_type,
            storage.storage_type === 'INDIVIDUAL' ? Number(storage.total_volume) : Number(total_volume),
            months
        );

        const orderData = {
            ...req.body,
            user_id,
            start_date,
            end_date,
            total_volume: storage.storage_type === 'INDIVIDUAL' ? Number(storage.total_volume) : Number(total_volume),
            total_price: total_price,
            created_at: new Date(),
        };

        const order = await Order.create(orderData, { transaction });

        const itemsToCreate = order_items.map(item => ({
            ...item,
            order_id: order.id
        }));

        await OrderItem.bulkCreate(itemsToCreate, { transaction });

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
    if (['OCCUPIED', 'PENDING', 'PROCESSING'].includes(storage.status)) {
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
    const newVolume = isIndividual ? 0 : storage.available_volume - total_volume;

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

function getTotalVolumeFromItems(items) {
    return items.reduce((total, item) => total + item.volume, 0);
}

export const validateForCanceling = async (order, user_id) => {
    if (!order) {
        throw Object.assign(new Error('Order not found'), { status: 404 });
    } else if (order.user_id !== user_id) {
        console.log(user_id);
        throw Object.assign(new Error('Request forbidden'), { status: 403 });
    } else if (order.status !== 'ACTIVE') {
        throw Object.assign(new Error('Order not ACTIVE'), { status: 404 });
    }
}

export const cancelOrder = async (orderId, userId) => {
    const tx = await sequelize.transaction();
    try {
        const order = await Order.findOne({
            where: { id: orderId }
        });
        await validateForCanceling(order, userId);

        order.status = 'CANCELED';
        await order.save({ transaction: tx });

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        await OrderPayment.update(
            { status: "CANCELED" },
            {
                where: {
                    order_id: order.id,
                    [Op.or]: [
                        { year: { [Op.gt]: currentYear } },
                        {
                            year: currentYear,
                            month: { [Op.gt]: currentMonth }
                        }
                    ]
                },
                transaction: tx
            }
        );

        await tx.commit();
    } catch (error) {
        await tx.rollback();
        error.status = 500;
        throw error;
    }
    notificationService.sendNotification({
        user_id: userId,
        title: "Ваш заказ был отменён",
        message: "Ваш заказ №" + orderId + " успешно отменён. Платежи за будущие месяцы были приостановлены.",
        notification_type: "contract",
        related_order_id: orderId,
        is_email: true,
        is_sms: true
    });
}
import {Order, OrderItem, Storage, User, OrderService, Service} from "../../models/init/index.js";
import * as priceService from "../price/PriceService.js";
import {sequelize} from "../../config/database.js";
import {DateTime} from 'luxon';
import * as storageService from "../storage/StorageService.js";
import logger from "../../utils/winston/logger.js";
import * as movingOrderService from "../moving/movingOrder.service.js";
import {fn, literal} from "sequelize";

export const getAll = async () => {
    return Order.findAll({
        include: [
            {
                association: 'storage'
            },
            {
                association: 'items'
            },
            {
                model: User,
                as: 'user',
                attributes: ['name', 'phone', 'email'],
            },
            {
                model: Service,
                as: 'services',
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
            },
            {
                model: User,
                as: 'user',
                attributes: ['name', 'phone', 'email'],
            },
            {
                model: Service,
                as: 'services',
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
            },
            {
                model: Service,
                as: 'services',
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

export const update = async (id, data, options = {}) => {
    return Order.update(data, {
        where: { id },
        ...options,
    });
};

export const approveOrder = async (id, data) => {
    const tx = await sequelize.transaction();
    try {
        const updatingOrder = await getById(id)
        if (!updatingOrder) {
            throw Object.assign(new Error('Not found'), { status: 400 });
        } else if (updatingOrder.status !== 'INACTIVE') {
            throw Object.assign(new Error('Approve only for inactive orders'), { status: 400 });
        }
        const updatedOrder = await update(id, data, { transaction: tx });

        if (data.is_selected_moving) {
            const enrichedMovingOrders = data.moving_orders.map(movingOrder => ({
                ...movingOrder,
                order_id: id,
                vehicle_type: 'LARGE',
                availability: 'NOT_AVAILABLE',
            }));

            await movingOrderService.bulkCreate(enrichedMovingOrders, { transaction: tx });
            await validateServiceIds(data?.services, tx);
            const enrichedOrderServices = data.services.map(service => ({
                ...service,
                order_id: id,
                count: service.count
            }))
            await OrderService.bulkCreate(enrichedOrderServices, { transaction: tx });
        }

        await tx.commit();
        return updatedOrder;
    } catch (error) {
        await tx.rollback();
        throw error;
    }
}

export const deleteById = async (id) => {
    const transaction = await sequelize.transaction();
    try {
        const order = await getById(id);
        if (!order) {
            throw Object.assign(new Error('Not found'), { status: 400 });
        }
        let newVolume = Number(order.storage.available_volume) + (Number(order.total_volume) - Number(order.storage.available_volume));
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

async function validateServiceIds(services, transaction) {
    if (!services || services?.length === 0){
        throw Object.assign(new Error('Выбран доставка но не выбраны сервисы'), { status: 400 });
    }

    const serviceIds = services.map(s => s.service_id);

    const existingServices = await Service.findAll({
        where: { id: serviceIds },
        transaction
    });

    if (existingServices.length !== serviceIds.length) {
        throw Object.assign(new Error('Некоторые services не найдены'), { status: 400 });
    }
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

export const getTotalServicePriceByOrderId = async (orderId) => {
    const result = await OrderService.findOne({
        where: { order_id: orderId },
        include: [
            {
                model: Service,
                as: 'service',
                attributes: []
            }
        ],
        attributes: [
            [fn('SUM', literal('"OrderService"."count" * "service"."price"')), 'total_services_price']
        ],
        raw: true
    });

    return Number(result?.total_services_price) || 0;
};
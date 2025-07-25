import {
    Contract,
    MovingOrder,
    Order,
    OrderItem,
    OrderPayment,
    OrderService,
    Service,
    Storage,
    User,
    Warehouse
} from "../../models/init/index.js";
import * as priceService from "../price/PriceService.js";
import {sequelize} from "../../config/database.js";
import {DateTime} from 'luxon';
import * as storageService from "../storage/StorageService.js";
import logger from "../../utils/winston/logger.js";
import * as movingOrderService from "../moving/movingOrder.service.js";
import {confirmOrChangeMovingOrder} from "../moving/movingOrder.service.js";
import {fn, literal, Op} from "sequelize";
import * as userService from "../user/UserService.js";
import {NotificationService} from "../notification/notification.service.js";
import * as orderPaymentService from "../order_payments/OrderPaymentsService.js";
import * as paymentService from "../payment/PaymentService.js";
import {createContract, getContractStatus, revokeContract} from "../contract/contract.service.js";

const notificationService = new NotificationService();

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
            },
            {
                model: MovingOrder,
                as: 'moving_orders',
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
                attributes: ['name', 'phone', 'email', 'role'],
            },
            {
                model: Service,
                as: 'services',
            }
        ]
    });
};

export const getByIdForContract = async (id, options = {}) => {
    return Order.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['name', 'phone', 'email','iin','address','bday'],
            },
            {
                model: Storage,
                as: 'storage',
            },
            {
                model: Contract,
                as: 'contracts',
            }
        ],
        ...options
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
            },
            {
                model: MovingOrder,
                as: 'moving_orders',
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

const contractStatusMap = {
    0: 'Не подписан',
    1: 'Подписан компанией',
    2: 'Подписан клиентом',
    3: 'Полностью подписан',
    4: 'Отозван компанией',
    5: 'Компания инициировала расторжение',
    6: 'Клиент инициировал расторжение',
    7: 'Клиент отказался от расторжения',
    8: 'Расторгнут',
    9: 'Клиент отказался подписывать договор',
};

export const getMyContracts = async (userId) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: userId ,status: {
                    [Op.not]: 'INACTIVE'
                } },
            include: [
                {
                    model: Storage,
                    as: 'storage',
                    attributes: ['name'],
                    include: [
                        {
                            model: Warehouse,
                            as: 'warehouse',
                            attributes: ['address'],
                        }

                    ]
                },
                {
                    model: Contract,
                    as: 'contracts',
                    required: false
                }
            ],
            order: [
                ['created_at', 'DESC']
            ]
        });

        if (!orders || orders.length === 0) {
            throw Object.assign(new Error('Not Found'), { status: 400 });
        }

        const formattedOrders = await Promise.all(orders.map(async order => {
            const latestContract = order.contracts?.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )[0] || null;
            return {
                order_id: order.id,
                storage_name: order.storage.name,
                warehouse_address: order.storage.warehouse?.address || null,
                total_volume: order.total_volume,
                rental_period: {
                    start_date: order.start_date,
                    end_date: order.end_date
                },
                contract_status: contractStatusMap[latestContract.status],
                contract_data: latestContract ? {
                    contract_id: latestContract.id,
                    document_id: latestContract.document_id,
                    url: latestContract.url
                } : null,
                payment_status: order.payment_status,
                order_status: order.status,
                created_at: order.created_at
            };
        }));


        return formattedOrders;
    } catch (error) {
        console.error('Error fetching orders with contracts:', error);
       throw error;
    }
};
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
        const {
            storage_id,
            order_items,
            months,
            is_selected_moving,
            moving_orders,
            is_selected_package,
            services,
            punct33
        } = req.body;
        const { id: user_id } = req.user;

        const user = await userService.getById(user_id);
        await userService.validateUserPhoneAndIIN(user);

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

        await Contract.create({
            order_id: order.id,
            punct33: punct33 ?? null
        },{ transaction: transaction });

        if (is_selected_moving) {
            const enrichedMovingOrders = moving_orders.map(movingOrder => ({
                ...movingOrder,
                order_id: order.id,
                vehicle_type: 'LARGE',
                availability: movingOrder.status === 'PENDING_FROM' ? 'AVAILABLE': 'NOT_AVAILABLE',
            }));

            await movingOrderService.bulkCreate(enrichedMovingOrders, { transaction: transaction });
        }
        if (is_selected_package) {
            await validateServiceIds(services, transaction);
            const enrichedOrderServices = services.map(service => ({
                ...service,
                order_id: order.id,
                count: service.count
            }))
            await OrderService.bulkCreate(enrichedOrderServices, { transaction: transaction });
        }

        await transaction.commit();
        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
export const getItemsByOrderId = async (id) => {
    const [items, movingOrders] = await Promise.all([
        OrderItem.findAll({ where: { order_id: id } }),
        MovingOrder.findAll({
            where: {
                order_id: id,
                availability: 'AVAILABLE'
            }
        })
    ]);

    return { items, movingOrders };
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

function calculateDates(months, start_date = null) {
    const start = start_date !== null
        ? DateTime.fromJSDate(new Date(start_date))
        : DateTime.now();

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

export const cancelOrder = async (orderId, userId,documentId) => {
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
        try {
            await revokeContract(documentId);
        } catch (e) {
            logger.error("Ошибка отзыва контракта", e);
        }
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
    confirmOrChangeMovingOrder(orderId);
    return true;
}

export const extendOrder = async (data, userId) => {
    const { order_id, months } = data;

    const tx = await sequelize.transaction();
    try {
        const user = await userService.getById(userId);
        const order = await Order.findByPk(order_id, {
            include: [ { association: 'storage' } ]
        }, { transaction: tx });

        if (!order) {
            throw Object.assign(new Error('Order not found'), { status: 404 });
        } else if (order.user_id !== user.id) {
            throw Object.assign(new Error('Forbidden'), { status: 403 });
        } else if (order.status !== 'ACTIVE') {
            throw Object.assign(new Error('Order not ACTIVE'), { status: 400 });
        } else if (order.extension_status !== 'PENDING') {
            throw Object.assign(new Error('Order extension status is invalid'), { status: 400 });
        } else if (order.payment_status !== 'PAID') {
            throw Object.assign(new Error('Payment status is invalid'), { status: 400 });
        }

        if (!data.is_extended) {
            order.extension_status = 'CANCELED';
            await order.save({ transaction: tx });
            await tx.commit();
            confirmOrChangeMovingOrder(order.id);
            return
        }

        const { start_date, end_date } = calculateDates(months, order.end_date);
        const total_price = await calculateTotalPrice(
            order.storage.storage_type,
            order.storage.storage_type === 'INDIVIDUAL' ? Number(order.storage.total_volume) : Number(order.total_volume),
            months
        );
        order.total_price = Number(order.total_price) + Number(total_price);
        order.end_date = end_date;
        order.extension_status = 'NO';
        await order.save({ transaction: tx });

        await MovingOrder.update({moving_date: end_date}, {
            where: {order_id: order.id, availability: 'NOT_AVAILABLE'}
        })

        const { orderPayments } = await paymentService.generateOrderPayments({
            start_date,
            end_date,
            total_price,
            id: order_id
        }, 0);

        await orderPaymentService.bulkCreate(orderPayments, { transaction: tx });
        await Contract.create({
            order_id: order_id,
        },{ transaction: tx });
        const contractData = await createContract(order.id, tx);
        logger.info("TRUST ME DATA", {response: contractData});
        await tx.commit();
    } catch (error) {
        await tx.rollback();
        throw error;
    }

    notificationService.sendNotification({
        user_id: userId,
        title: "Ваш заказ продлено",
        message: "Ваш заказ №" + order_id + " успешно продлено.",
        notification_type: "contract",
        related_order_id: order_id,
        is_email: true,
        is_sms: true
    });
};

export const checkToActiveOrder = async (order_id) => {
    logger.info("method checkToActiveOrder");
    if (!order_id) {
        logger.warn("Check To Active Order: Missing parameters");
        return;
    }

    const contract = await Contract.findOne({
        where: {order_id: order_id}
    });

    if (!contract) {
        logger.warn("Check To Active Order: Contract not found");
        return;
    }

    const docId = contract.document_id;
    const contractStatus = await getContractStatus(docId);
    const order = await Order.findByPk(contract.order_id);

    logger.info("CONTRACT STATUS", { body: contractStatus });

    if (contractStatus === 3 && order?.payment_status === 'PAID') {
        await order.update({ status: 'ACTIVE' });
        logger.info("SUCCESS UPDATE ORDER STATUS", { body: order.status });
    }
};

export const approveOrder = async (order_id, user_id) => {
    const tx = await sequelize.transaction();
    try {
        const order = await Order.findByPk(order_id, {
            transaction: tx
        });
        if (!order) {
            throw Object.assign(new Error('Order not found'), { status: 200 });
        } else if (order.user_id !== user_id) {
            throw Object.assign(new Error('Forbidden'), { status: 403 });
        }

        order.status = 'APPROVED';
        order.save({ transaction: tx });

        const contractData = await createContract(order.id, tx);
        logger.info("TRUST ME DATA", {response: contractData});

        await tx.commit();
    } catch (error) {
        await tx.rollback();
        logger.error(error);
        throw error;
    }
}
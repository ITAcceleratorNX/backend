import {MovingOrder, Order, Service, User, Warehouse, Storage, OrderItem} from '../../models/init/index.js';
import {NotificationService} from "../notification/notification.service.js";
const notificationService = new NotificationService();

export const createOrder = async (data) => {
    return await MovingOrder.create(data);
};

export const getAllOrders = async () => {
    return await MovingOrder.findAll();
};

export const getOrderById = async (id) => {
    const movingOrder = await MovingOrder.findByPk(id);

    if (!movingOrder) return null;

    const order = await Order.findByPk(movingOrder.order_id, {
        include: [
            {
                model: Storage,
                as: 'storage',
                include: [
                    {
                        model: Warehouse,
                        as: 'warehouse',
                        attributes: ['address']
                    }
                ],
                attributes: ['name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['address']
            },
            {
                model: Service,
                as: 'services',
                where: {
                    type: ['LIGHT', 'STANDARD', 'HARD']
                },
                attributes: ['description', 'type'],
                through: { attributes: [] },
                required: true
            },
            {
                model: OrderItem,
                as: 'items',
                attributes: ['id', 'name', 'volume', 'cargo_mark'],
            }
        ]
    });

    const serviceDescriptions = order?.services?.map(s => s.description) || [];

    return {
        movingOrderId: movingOrder.id,
        status: movingOrder.status,
        warehouseAddress: order?.storage?.warehouse?.address || null,
        storageName: order?.storage?.name || null,
        userAddress: order?.user?.address || null,
        serviceDescriptions,
        availability: movingOrder.availability || null,
        items: order?.items || []
    };
};

export const updateOrder = async (id, data) => {
    const order = await MovingOrder.findByPk(id);
    if (!order) return null;

    const foundOrder = await Order.findByPk(order.order_id);
    const userId = foundOrder?.user_id;

    if (order.status === 'PENDING_FROM' && data.status === 'IN_PROGRESS') {
        notificationService.sendNotification({
            user_id: userId,
            title: 'Доставка вещей',
            message: 'К вам направлен грузовик для забора ваших вещей.',
            notification_type: 'general',
            is_email: true,
            is_sms: false
        });
    } else if (order.status === 'PENDING_TO' && data.status === 'IN_PROGRESS') {
        notificationService.sendNotification({
            user_id: userId,
            title: 'Доставка вещей',
            message: 'К вам направлен грузовик для доставки ваших вещей.',
            notification_type: 'general',
            is_email: true,
            is_sms: false
        });
    }

    return await order.update(data);
};


export const deleteOrder = async (id) => {
    const order = await MovingOrder.findByPk(id);
    if (!order) return false;
    await order.destroy();
    return true;
};
export const getDeliveredOrdersPaginated = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const { rows: movings, count: total } = await MovingOrder.findAndCountAll({
        where: { status: 'DELIVERED' },
        offset,
        limit
    });

    const results = [];

    for (const item of movings) {
        const order = await Order.findByPk(item.order_id, {
            include: [
                {
                    model: Storage,
                    as: 'storage',
                    include: [
                        {
                            model: Warehouse,
                            as: 'warehouse',
                            attributes: ['address']
                        }
                    ],
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['address']
                },
                {
                    model: Service,
                    as: 'services',
                    where: {
                        type: ['LIGHT', 'STANDARD', 'HARD']
                    },
                    attributes: ['description', 'type'],
                    through: { attributes: [] },
                    required: true
                },
                {
                    model: OrderItem,
                    as: 'items',
                    attributes: ['id', 'name', 'volume', 'cargo_mark'],
                }
            ]
        });

        const serviceDescriptions = order?.services?.map(s => s.description) || [];

        results.push({
            movingOrderId: item.id,
            status: item.status,
            warehouseAddress: order?.storage?.warehouse?.address || null,
            storageName: order?.storage?.name || null,
            userAddress: order?.user?.address || null,
            serviceDescriptions,
            availability: item.availability || null,
            items: order?.items || []
        });
    }

    return {
        total,          // Общее количество записей
        page,           // Текущая страница
        limit,          // Размер страницы
        results         // Сами заказы
    };
};

export const getOrdersByStatus = async (status) => {
    const movings = await MovingOrder.findAll({ where: { status } });
    console.log(movings);
    const results = [];

    for (const item of movings) {
        const order = await Order.findByPk(item.order_id, {
            include: [
                {
                    model: Storage,
                    as: 'storage',
                    include: [
                        {
                            model: Warehouse,
                            as: 'warehouse',
                            attributes: ['address']
                        }
                    ],
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['address']
                },
                {
                    model: Service,
                    as: 'services',
                    where: {
                        type: ['LIGHT', 'STANDARD', 'HARD']
                    },
                    attributes: ['description', 'type'],
                    through: { attributes: [] },
                    required: true
                },
                {
                    model: OrderItem,
                    as: 'items',
                    attributes: ['id', 'name', 'volume', 'cargo_mark'],
                }

            ]
        });


        const serviceDescriptions = order?.services?.map(s => s.description) || [];

        results.push({
            movingOrderId: item.id,
            status: item.status,
            warehouseAddress: order?.storage?.warehouse?.address || null,
            storageName: order?.storage?.name || null,
            userAddress: order?.user?.address || null,
            serviceDescriptions,
            availability: item.availability || null,
            items: order?.items || []
        });
    }

    return results;
};


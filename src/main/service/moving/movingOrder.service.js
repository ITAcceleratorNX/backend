import {MovingOrder, Order, Service, User, Warehouse, Storage, OrderItem} from '../../models/init/index.js';
import {NotificationService} from "../notification/notification.service.js";
const notificationService = new NotificationService();

export const createOrder = async (data) => {
    return await MovingOrder.create(data);
};

export const bulkCreate = async (data, options = {}) => {
    return MovingOrder.bulkCreate(data, options);
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
                attributes: ['address','phone','name']
            },
            {
                model: Service,
                as: 'services',
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
        userName: order?.user?.name || null,
        userPhone: order?.user?.phone || null,
        serviceDescriptions,
        availability: movingOrder.availability || null,
        items: order?.items || []
    };
};
export const getItemDocumentData = async (itemId) => {
    const item = await OrderItem.findByPk(itemId);

    if (!item) return null;

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
                attributes: ['address', 'phone', 'name']
            },
            {
                model: MovingOrder,
                as: 'moving_orders',
                where: { availability: 'AVAILABLE' },
                required: false
            }
        ]
    });

    const movingOrder = order?.moving_orders?.[0];

    return {
        item: {
            id: item.id,
            name: item.name,
            volume: item.volume,
            cargo_mark: item.cargo_mark
        },
        movingOrderId: movingOrder?.id || null,
        status: movingOrder?.status || null,
        warehouseAddress: order?.storage?.warehouse?.address || null,
        storageName: order?.storage?.name || null,
        userAddress: order?.user?.address || null,
        userName: order?.user?.name || null,
        userPhone: order?.user?.phone || null,
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
    } else if (data.availability === 'AWAITABLE') {
        notificationService.sendNotification({
            user_id: userId,
            title: 'Доставка вещей',
            message: "Здравствуйте!\n" +
                `Мы готовим доставку ваших вещей по вашему заказу #${foundOrder.id}. Пожалуйста, подтвердите дату и адрес доставки до вашего дома, указанные при оформлении.\n` +
                "Если вы хотите изменить дату или адрес, пожалуйста, измените его на платформе как можно скорее, чтобы мы могли учесть изменения.\n" +
                "Спасибо за использование нашего сервиса!\n\n" +
                "С уважением,\n" +
                "Extraspace",
            notification_type: 'general',
            is_email: true,
            is_sms: false
        })
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
                    model: Service,
                    as: 'services',
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
            userAddress: item?.address || null,
            serviceDescriptions,
            availability: item.availability || null,
            items: order?.items || [],
        });
    }

    return results;
};

export const confirmOrChangeMovingOrder = async (order_id) => {
    const movingOrders = await MovingOrder.findAll({
        where: { order_id, availability: 'NOT_AVAILABLE', status: 'PENDING_TO' },
    });
    if (movingOrders.length === 0) return null;
    for (const movingOrder of movingOrders) {
        updateOrder(movingOrder.id, {availability: 'AWAITABLE'});
    }
    return true;
}

export const getMyMovings = async (user_id) => {
    return await MovingOrder.findAll({
        include: [{
            model: Order,
            as: 'order',
            where: { user_id },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    attributes: ['name']
                }
            ],
            attributes: []
        }]
    });
};
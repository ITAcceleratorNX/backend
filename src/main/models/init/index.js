import { OrderItem } from "../OrderItem.js";
import Callback from '../Callback.js';
import Order from '../Order.js';
import FAQ from '../Faq.js';
import MovingOrder from '../MovingOrder.js';
import Notification from '../Notification.js';
import Service from '../Service.js';
import Storage from '../Storage.js';
import User from '../User.js';
import Warehouse from '../Warehouse.js';
import Chat from "../Chat.js";
import Message from "../Message.js";
import OrderPayment from "../OrderPayment.js";
import Transaction from "../Transactions.js";
import OrderService from "../OrderService.js";
import UserNotification from "../UserNotifications.js";


// Order - User
Order.belongsTo(User, { foreignKey: 'user_id' , as: 'user'});
User.hasMany(Order, { foreignKey: 'user_id' , as: 'orders'});

// Order - Storage
Storage.hasMany(Order, { foreignKey: 'storage_id', as: 'orders' } );
Order.belongsTo(Storage, { foreignKey: 'storage_id', as : 'storage' });

// MovingOrder - Contract
MovingOrder.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(MovingOrder, { foreignKey: 'order_id' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Storage - Warehouse
Warehouse.hasMany(Storage, { foreignKey: 'warehouse_id', as: 'storage' });
Storage.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

// Order - OrderPayment
Order.hasMany(OrderPayment, { foreignKey: 'order_id' , as: 'order_payment'});
OrderPayment.belongsTo(Order, { foreignKey: 'order_id' , as : 'order'});

User.hasMany(Chat, { foreignKey: 'user_id', as: 'chat' });
Chat.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Chat.hasMany(Message, { foreignKey: 'chat_id' });
Message.belongsTo(Chat, { foreignKey: 'chat_id' });

OrderPayment.hasMany(Transaction, { foreignKey: 'order_payment_id', as: 'transactions' });
Transaction.belongsTo(OrderPayment, { foreignKey: 'order_payment_id', as: 'order_payment' });

Order.belongsToMany(Service, {
    through: OrderService,
    foreignKey: 'order_id',
    otherKey: 'service_id',
    as: 'services' // ← вот это важно
});

Service.belongsToMany(Order, {
    through: OrderService,
    foreignKey: 'service_id',
    otherKey: 'order_id',
    as: 'orders' // опционально
});

OrderService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });
Service.hasMany(OrderService, { foreignKey: 'service_id', as: 'order_services' });

Notification.hasMany(UserNotification, {
    foreignKey: 'notification_id',
});
UserNotification.belongsTo(Notification, {
    foreignKey: 'notification_id',
});
// Notification - User
User.hasMany(UserNotification, { foreignKey: 'user_id' });
UserNotification.belongsTo(User, { foreignKey: 'user_id' });

export {
    Callback,
    Order,
    FAQ,
    MovingOrder,
    Notification,
    Service,
    Storage,
    User,
    Warehouse,
    Chat,
    Message,
    OrderPayment,
    Transaction,
    OrderItem,
    OrderService,
    UserNotification
};


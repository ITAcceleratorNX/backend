import Callback from '../Callback.js';
import Order from '../Order.js';
import FAQ from '../Faq.js';
import MovingOrder from '../MovingOrder.js';
import Notification from '../Notification.js';
import Price from '../Price.js';
import Storage from '../Storage.js';
import User from '../User.js';
import Warehouse from '../Warehouse.js';
import Chat from "../Chat.js";
import Message from "../Message.js";
import StorageCells from "../StorageCells.js";
import OrderCells from "../OrderCell.js";
import OrderPayment from "../OrderPayment.js";
import PaymentTransaction from "../PaymentTransaction.js";


// Contract - User
Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

// Contract - Storage
Order.belongsTo(Storage, { foreignKey: 'storage_id' });
Storage.hasMany(Order, { foreignKey: 'storage_id' });

// MovingOrder - Contract
MovingOrder.belongsTo(Order, { foreignKey: 'contract_id' });
Order.hasMany(MovingOrder, { foreignKey: 'contract_id' });

// Notification - User
Notification.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });

// Storage - Warehouse
Storage.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });
Warehouse.hasMany(Storage, { foreignKey: 'warehouse_id' });

// Order - OrderPayment
Order.hasMany(OrderPayment, { foreignKey: 'order_id' });
OrderPayment.belongsTo(Order, { foreignKey: 'order_id' });

// OrderPayment - PaymentTransaction
OrderPayment.hasMany(PaymentTransaction, { foreignKey: 'order_payment_id' });
PaymentTransaction.belongsTo(OrderPayment, { foreignKey: 'order_payment_id' });

User.hasMany(Chat, { foreignKey: 'user_id' });
Chat.belongsTo(User, { foreignKey: 'user_id' });

Chat.hasMany(Message, { foreignKey: 'chat_id' });
Message.belongsTo(Chat, { foreignKey: 'chat_id' });

// Storage - StorageCells
Storage.hasMany(StorageCells, {
    foreignKey: 'storage_id',
    as: 'cells'
});

StorageCells.belongsTo(Storage, {
    foreignKey: 'storage_id',
    as: 'storage'
});

//Order - OrderCell
Order.belongsToMany(StorageCells, {
    through: OrderCells,
    foreignKey: 'order_id',
    otherKey: 'cell_id',
});

StorageCells.belongsToMany(Order, {
    through: OrderCells,
    foreignKey: 'cell_id',
    otherKey: 'order_id',
});

export {
    Callback,
    Order,
    OrderCells,
    FAQ,
    MovingOrder,
    Notification,
    Price,
    Storage,
    User,
    Warehouse,
    Chat,
    Message,
    StorageCells,
    OrderPayment,
    PaymentTransaction
};


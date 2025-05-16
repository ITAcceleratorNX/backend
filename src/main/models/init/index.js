import Callback from '../Callback.js';
import Order from '../Order.js';
import FAQ from '../Faq.js';
import MovingOrder from '../MovingOrder.js';
import Notification from '../Notification.js';
import PaymentSystem from '../PaymentSystem.js';
import Price from '../Price.js';
import Storage from '../Storage.js';
import Transaction from '../Transaction.js';
import TransactionStatus from '../TransactionStatus.js';
import User from '../User.js';
import Warehouse from '../Warehouse.js';
import Chat from "../Chat.js";
import Message from "../Message.js";
import StorageCells from "../StorageCells.js";
import OrderCells from "../OrderCell.js";

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

// Transaction - PaymentSystem
Transaction.belongsTo(PaymentSystem, { foreignKey: 'payment_id' });
PaymentSystem.hasMany(Transaction, { foreignKey: 'payment_id' });

// Transaction - TransactionStatus
Transaction.belongsTo(TransactionStatus, { foreignKey: 'status_code', targetKey: 'status_code' });
TransactionStatus.hasMany(Transaction, { foreignKey: 'status_code', sourceKey: 'status_code' });

User.hasMany(Chat, { foreignKey: 'user_id' });
Chat.belongsTo(User, { foreignKey: 'user_id' });

Chat.hasMany(Message, { foreignKey: 'chat_id' });
Message.belongsTo(Chat, { foreignKey: 'chat_id' });
Transaction.belongsTo(MovingOrder, { foreignKey: 'order_id' });
MovingOrder.hasMany(Transaction, { foreignKey: 'order_id' });

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
    PaymentSystem,
    Price,
    Storage,
    Transaction,
    TransactionStatus,
    User,
    Warehouse,
    Chat,
    Message,
    StorageCells
};

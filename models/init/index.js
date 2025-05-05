import Callback from '../Callback.js';
import Contract from '../Contract.js';
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


// Contract - User
Contract.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Contract, { foreignKey: 'user_id' });

// Contract - Storage
Contract.belongsTo(Storage, { foreignKey: 'storage_id' });
Storage.hasMany(Contract, { foreignKey: 'storage_id' });

// MovingOrder - Contract
MovingOrder.belongsTo(Contract, { foreignKey: 'contract_id' });
Contract.hasMany(MovingOrder, { foreignKey: 'contract_id' });

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

Transaction.belongsTo(MovingOrder, { foreignKey: 'order_id' });
MovingOrder.hasMany(Transaction, { foreignKey: 'order_id' });

export {
    Callback,
    Contract,
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
};

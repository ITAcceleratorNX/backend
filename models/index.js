import { Sequelize } from "sequelize";

// Импорт моделей
import { User } from './User.js';
import { UserRole } from './UserRole.js';
import { Warehouse } from './Warehouse.js';
import { WarehouseStatus } from './WarehouseStatus.js';
import { StorageType } from './StorageType.js';
import { Price } from './Price.js';
import { PriceType } from './PriceType.js';
import { Order } from './Order.js';
import { OrderItem } from './OrderItem.js';
import { Transaction } from './Transaction.js';
import { MovingOrder } from './MovingOrder.js';
import { Callback } from './Callback.js';
import { FAQ } from './Faq.js';
import { FAQCategory } from './FaqCategory.js';

const models = {
    User,
    UserRole,
    Warehouse,
    WarehouseStatus,
    StorageType,
    Price,
    PriceType,
    Order,
    OrderItem,
    Transaction,
    MovingOrder,
    Callback,
    FAQ,
    FAQCategory
};

let sequelizeInstance = null;

export async function initSequelize(sequelize) {
    for (const modelName in models) {
        if (models[modelName].init && typeof models[modelName].init === 'function') {
            models[modelName].init(sequelize);
        }
    }
    await sequelize.sync();

    console.log('🟢 Sequelize models are synced');
}

export function getSequelize() {
    if (!sequelizeInstance) {
        throw new Error('Sequelize has not been initialized. Call initSequelize() first.');
    }
    return sequelizeInstance;
}

export function getModels() {
    return models;
}

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const OrderItem = sequelize.define('OrderItem', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    item_type_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    related_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    final_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    duration_days: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'order_items',
    timestamps: false
});

export default OrderItem;
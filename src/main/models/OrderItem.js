import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    volume: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    cargo_mark: {
        type: DataTypes.ENUM('NO', 'HEAVY', 'FRAGILE'),
        allowNull: false
    }
}, {
    tableName: 'order_items',
    timestamps: false
});

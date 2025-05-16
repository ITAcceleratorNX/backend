import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

const OrderCells = sequelize.define('OrderCells', {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'orders',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    cell_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'storage_cells',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'order_cells',
    timestamps: false,
});

export default OrderCells;
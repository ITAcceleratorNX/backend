import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

export const OrderService = sequelize.define('OrderService', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id',
        }
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'services',
            key: 'id',
        }
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }

}, {
    tableName: 'order_services',
    timestamps: false
});

export default OrderService;
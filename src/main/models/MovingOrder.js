import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

export const MovingOrder = sequelize.define('MovingOrder', {
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
    moving_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    vehicle_type: {
        type: DataTypes.ENUM('SMALL', 'MEDIUM', 'LARGE'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING_FROM', 'PENDING_TO','IN_PROGRESS', 'DELIVERED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING_FROM'
    },
    availability: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'NOT_AVAILABLE'
    }

}, {
    tableName: 'moving_orders',
    timestamps: false
});

export default MovingOrder;
import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

export const MovingOrder = sequelize.define('MovingOrder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contract_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'contracts',
            key: 'id',
        }
    },
    address_from: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address_to: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    moving_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    vehicle_type: {
        type: DataTypes.ENUM('SMALL', 'MEDIUM', 'LARGE'),
        allowNull: false,
    },
}, {
    tableName: 'moving_orders',
    timestamps: false
});

export default MovingOrder;
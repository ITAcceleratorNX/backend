import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const MovingOrder = sequelize.define('MovingOrder', {
    moving_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    from_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    to_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    moving_date: {
        type: DataTypes.DATE
    },
    vehicle_type: {
        type: DataTypes.ENUM('small', 'medium', 'large')
    }
}, {
    tableName: 'moving_orders',
    timestamps: false
});

export default MovingOrder;
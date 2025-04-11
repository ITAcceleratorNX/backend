import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE
    },
    order_type_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: 'orders',
    timestamps: false
});

export default Order;
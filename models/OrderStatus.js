import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderStatus = sequelize.define('OrderStatus', {
    status_code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    status_name: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'order_statuses',
    timestamps: false
});

export default OrderStatus;
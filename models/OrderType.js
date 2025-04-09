import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderType = sequelize.define('OrderType', {
    order_type_code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    order_type_name: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'order_types',
    timestamps: false
});

export default OrderType;
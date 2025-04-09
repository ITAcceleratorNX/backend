import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderItemType = sequelize.define('OrderItemType', {
    item_type_code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    item_type_name: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'order_item_types',
    timestamps: false
});

export default OrderItemType;
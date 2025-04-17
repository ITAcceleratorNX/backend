import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CloudItem = sequelize.define('CloudItem', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storage_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    volume: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: 'cloud_items',
    timestamps: false
});

export default CloudItem;
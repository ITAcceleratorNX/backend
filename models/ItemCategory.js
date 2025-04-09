import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ItemCategory = sequelize.define('ItemCategory', {
    category_code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    category_name: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'item_categories',
    timestamps: false
});

export default ItemCategory;
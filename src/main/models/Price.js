import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

export const Price = sequelize.define('Price', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM("INDIVIDUAL", "CLOUD", "RACK", "MOVING"),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
}, {
    tableName: 'prices',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['type'],
            name: 'unique_price_type'
        }
    ]
});

export default Price;
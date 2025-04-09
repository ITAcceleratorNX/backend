import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Price = sequelize.define('Price', {
    price_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storage_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valid_from: {
        type: DataTypes.DATE,
        allowNull: false
    },
    valid_to: {
        type: DataTypes.DATE
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'KZT'
    },
    price_type_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    min_duration: {
        type: DataTypes.INTEGER
    },
    max_duration: {
        type: DataTypes.INTEGER
    },
    conditions: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'price',
    timestamps: false
});

export default Price;
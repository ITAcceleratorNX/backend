import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

export const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM("INDIVIDUAL", "CLOUD", "RACK", "LIGHT", "STANDARD", "HARD", "DEPOSIT"),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
}, {
    tableName: 'services',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['type'],
            name: 'unique_price_type'
        }
    ]
});

export default Service;
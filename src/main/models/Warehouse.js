import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

export const Warehouse = sequelize.define('Warehouse', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    work_start: {
        type: DataTypes.TIME,
        allowNull: false
    },
    work_end: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("AVAILABLE", "UNAVAILABLE"),
        allowNull: false,
        defaultValue: "AVAILABLE"
    }
}, {
    tableName: 'warehouses',
    timestamps: false
});

export default Warehouse;
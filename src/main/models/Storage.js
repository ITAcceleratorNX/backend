import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

const Storage = sequelize.define('Storage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'warehouses',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    storage_type: {
        type: DataTypes.ENUM("INDIVIDUAL", "CLOUD", "RACK"),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING(255)
    },
    height: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    total_volume: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('OCCUPIED', 'VACANT'),
        allowNull: false,
        defaultValue: "VACANT"
    }
}, {
    tableName: 'storages',
    timestamps: false
});

export default Storage;
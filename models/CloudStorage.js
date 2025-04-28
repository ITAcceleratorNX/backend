import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const CloudStorage = sequelize.define('cloud_storage', {
    storage_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    length: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    width: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    total_volume: {
        type: DataTypes.FLOAT,
        allowNull: true, // авто есептеледі
    },
    custom_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true, // авто есептеледі
    },
    status: {
        type: DataTypes.ENUM('available', 'occupied', 'maintenance'),
        defaultValue: 'available',
    }
}, {
    timestamps: false,
});

export default CloudStorage;

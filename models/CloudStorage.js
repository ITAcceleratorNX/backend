import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CloudStorage = sequelize.define('CloudStorage', {
    storage_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'completed')
    },
    total_volume_used: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'cloud_storage',
    timestamps: false
});

export default CloudStorage;
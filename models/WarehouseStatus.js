import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const WarehouseStatus = sequelize.define('WarehouseStatus', {
    status_code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    status_name: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'warehouse_statuses',
    timestamps: false
});

export default WarehouseStatus;
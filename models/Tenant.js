import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tenant = sequelize.define('Tenant', {
    tenant_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    storage_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'completed'),
        defaultValue: 'active'
    }
}, {
    tableName: 'tenants',
    timestamps: false
});

export default Tenant;

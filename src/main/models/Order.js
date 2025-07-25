import {DataTypes} from "sequelize";
import {sequelize} from '../config/database.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    storage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'storages',
            key: 'id',
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    total_volume: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    contract_status: {
        type: DataTypes.ENUM('SIGNED','UNSIGNED'),
        allowNull: false,
        defaultValue: 'UNSIGNED',
    },
    payment_status: {
        type: DataTypes.ENUM('PAID','UNPAID'),
        allowNull: false,
        defaultValue: 'UNPAID',
    },
    status: {
        type: DataTypes.ENUM('ACTIVE','INACTIVE', 'APPROVED', 'PROCESSING', 'CANCELED', 'FINISHED'),
        allowNull: false,
        defaultValue: 'INACTIVE',
    },
    created_at: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    is_selected_moving: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    is_selected_package: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    extension_status: {
        type: DataTypes.ENUM('NO','PENDING','CANCELED'),
        allowNull: false,
        defaultValue: 'NO',
    }
}, {
    tableName: 'orders',
    timestamps: false,
});
export default Order;
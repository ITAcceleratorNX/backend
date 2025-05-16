import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PaymentTransaction = sequelize.define('PaymentTransaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'order_payments',
            key: 'id',
        }
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING',
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'payment_transactions',
    timestamps: false,
});

export default PaymentTransaction;

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    order_payment_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'order_payments',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    payment_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    operation_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    payment_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    operation_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    operation_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    error_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    recurrent_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    created_date: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    payer_info: {
        type: DataTypes.JSONB,
        allowNull: true,
    }
}, {
    tableName: 'transactions',
    timestamps: false,
});

export default Transaction;
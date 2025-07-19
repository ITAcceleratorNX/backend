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
        allowNull: true,
    },
    operation_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    payment_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    operation_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    operation_status: {
        type: DataTypes.STRING(50),
        allowNull: true,
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
        type: DataTypes.DATE,
        allowNull: true,
    },
    payment_date: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    payer_info: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    clearing_status: {
        type: DataTypes.ENUM('SUCCESS','FAILED','PENDING'),
        allowNull: false,
        defaultValue: 'PENDING',
    }
}, {
    tableName: 'transactions',
    timestamps: false,
});

export default Transaction;
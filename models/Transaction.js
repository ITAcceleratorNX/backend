import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    transaction_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'transactions',
    timestamps: false
});

export default Transaction;
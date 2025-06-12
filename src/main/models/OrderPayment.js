import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const OrderPayment = sequelize.define('OrderPayment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id',
        }
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PAID', 'UNPAID'),
        allowNull: false,
        defaultValue: 'UNPAID',
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    payment_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'order_payments',
    timestamps: false,
});

export default OrderPayment;

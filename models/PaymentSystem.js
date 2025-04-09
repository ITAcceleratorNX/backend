import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PaymentSystem = sequelize.define('PaymentSystem', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: 'payment_systems',
    timestamps: false
});

export default PaymentSystem;
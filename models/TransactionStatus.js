import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TransactionStatus = sequelize.define('TransactionStatus', {
    status_code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    status_name: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'transaction_statuses',
    timestamps: false
});

export default TransactionStatus;
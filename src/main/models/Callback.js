import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Callback = sequelize.define('Callback', {
    callback_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('new', 'processed')
    },
    created_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'callbacks',
    timestamps: false
});

export default Callback;
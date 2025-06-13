import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

const Notification = sequelize.define('Notification', {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    notification_type: {
        type: DataTypes.ENUM( 'payment', 'contract', 'general'),
        defaultValue: 'general',
    },
    related_order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_sms: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'notifications',
    timestamps: false,
});
export default Notification;
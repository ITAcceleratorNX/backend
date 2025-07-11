// models/UserNotification.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UserNotification = sequelize.define('UserNotification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'notifications',
            key: 'notification_id',
        },
        onDelete: 'CASCADE',
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'user_notifications',
    timestamps: false,
});

export default UserNotification;

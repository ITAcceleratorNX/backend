import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    registration_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW()
    },
    last_login: {
        type: DataTypes.DATE
    },
    role_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false
});

export default User;

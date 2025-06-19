import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

export const User = sequelize.define('User', {
    id: {
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
    iin: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(255),
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
    role: {
        type: DataTypes.ENUM("ADMIN", "USER", "MANAGER","COURIER"),
        allowNull: false,
        defaultValue: 'USER'
    },
    recurrent_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: false
});

export default User;
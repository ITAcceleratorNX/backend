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
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING(255)
    },
    registration_date: {
        type: DataTypes.DATE
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

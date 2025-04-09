import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserRole = sequelize.define('UserRole', {
    role_code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    role_name: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'user_roles',
    timestamps: false
});

export default UserRole;
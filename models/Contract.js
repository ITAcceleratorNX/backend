
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
const Contract = sequelize.define('Contract', {
    contract_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    contract_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    expiration_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    contract_type: {
        type: DataTypes.ENUM('individual', 'cloud', 'moving'),
        allowNull: false,
    },
    contract_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'expired', 'terminated'),
        defaultValue: 'active',
    },
}, {
    tableName: 'contracts',
    timestamps: false,
});
export default Contract;
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Contract = sequelize.define('Contract', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    document_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    file_name: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    punct33: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'contracts',
    timestamps: false
});

export default Contract;

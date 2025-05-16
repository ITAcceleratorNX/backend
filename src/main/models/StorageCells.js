import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js';

const StorageCells = sequelize.define('StorageCells', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'storages',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    x: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    y: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_occupied: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'storage_cells',
    timestamps: false
});

export default StorageCells;
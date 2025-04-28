import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RackItem = sequelize.define('RackItem', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rack_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    volume: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'rack_items',
    timestamps: false
});

export default RackItem;

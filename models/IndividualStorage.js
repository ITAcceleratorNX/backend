import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const IndividualStorage = sequelize.define('IndividualStorage', {
    unit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    image_url: {
        type: DataTypes.STRING(255)
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    total_volume: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('occupied', 'vacant')
    },
    rental_start: {
        type: DataTypes.DATE
    },
    rental_end: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'individual_storage',
    timestamps: false
});

export default IndividualStorage;
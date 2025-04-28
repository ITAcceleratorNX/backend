import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Delivery = sequelize.define('Delivery', {
    delivery_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rack_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    package_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'delivered'),
        defaultValue: 'pending',
    }
}, {
    tableName: 'deliveries',
    timestamps: true,
});

export default Delivery;

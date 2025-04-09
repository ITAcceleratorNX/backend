import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StorageType = sequelize.define('StorageType', {
    type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    storage_kind: {
        type: DataTypes.ENUM('individual', 'cloud')
    },
    description: {
        type: DataTypes.TEXT
    },
    image_url: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'storage_types',
    timestamps: false
});

export default StorageType;
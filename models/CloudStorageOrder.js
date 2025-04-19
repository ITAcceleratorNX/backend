import sequelize from "../config/database.js";
import {DataTypes} from "sequelize";

const CloudStorageOrder = sequelize.define('CloudStorageOrder', {
    storage_order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    storage_id: { type: DataTypes.INTEGER, allowNull: false },
    volume: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    rental_start: { type: DataTypes.DATE, allowNull: false },
    rental_end: { type: DataTypes.DATE, allowNull: false }
}, {
    tableName: 'cloud_storage_orders',
    timestamps: false
});
export default CloudStorageOrder
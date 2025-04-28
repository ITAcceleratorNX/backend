// models/RackStorage.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const RackStorage = sequelize.define("rack_storage", {
    rack_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    custom_id: {
        type: DataTypes.STRING,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    occupied_volume: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
});

export default RackStorage;

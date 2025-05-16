import {DataTypes} from "sequelize";
import {sequelize} from '../config/database.js';

const Contract = sequelize.define('Contract', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    storage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'storages',
            key: 'id',
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_volume: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    item_width: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    item_length: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    item_height: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    deposit: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    monthly_rent_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING','ACTIVE', 'EXPIRED', 'TERMINATED'),
        defaultValue: 'ACTIVE',
    },
    created_at: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    }

}, {
    tableName: 'contracts',
    timestamps: false,
});
export default Contract
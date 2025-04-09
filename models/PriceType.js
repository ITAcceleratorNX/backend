import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PriceType = sequelize.define('PriceType', {
    price_type_code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    price_type_name: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'price_types',
    timestamps: false
});

export default PriceType;
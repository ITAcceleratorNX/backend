import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FAQCategory = sequelize.define('FAQCategory', {
    category_code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    category_name: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'faq_categories',
    timestamps: false
});

export default FAQCategory;
import dotenv from 'dotenv';
import {createSequelize} from "./factory/sequelizeFactory.js";

dotenv.config();

export const sequelize = createSequelize({
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
})

export default sequelize;
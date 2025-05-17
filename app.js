import dotenv from 'dotenv';
import {sequelize} from './config/database.js';
import appFactory from './config/factory/appFactory.js';

dotenv.config();
const app = appFactory();

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection successful');

        if (process.env.NODE_ENV === "development") {
            //await sequelize.sync({alter: false});
            console.log('🛠 In Development mode, models can be synchronized.');
        }

    } catch (error) {
        console.error('❌ Connection error:', error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export default app;

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from '../../config/passport.js';
import googleAuthRoutes from '../../routes/auth/google.js';
import basicAuthRoutes from '../../routes/auth/BasicAuthRouter.js';
import { authenticateJWT } from "../../middleware/jwt.js";
import * as fs from "node:fs";
import * as yaml from "yaml";
import swaggerUi from "swagger-ui-express";
import individualStorageRoutes from "../../routes/storage/StorageRoutes.js";
import warehouseRoutes from "../../routes/warehouse/WarehouseRoutes.js";
import userRoutes from '../../routes/user/UserRoutes.js';
import cookieParser from 'cookie-parser';
import http from "http";
import { setWSS } from "../ws.js";
import sequelize from "../database.js";

import logger from "../../utils/winston/logger.js";
import {errorHandler} from "../../middleware/errorHandler.js";
import chatRoutes from "../../routes/chat/ChatRoutes.js";
import priceRoutes from "../../routes/price/PriceRoutes.js";
import FAQRoutes from "../../routes/faq/FAQRoutes.js";

export default function appFactory() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors({
        origin: ['http://localhost:5173', process.env.FRONTEND_URL],
        credentials: true
    }));

    const server = http.createServer(app);
    setWSS(server);

    // Swagger
    const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
    const swaggerDocument = yaml.parse(swaggerFile);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    }));
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('✅ Все таблицы синхронизированы');
        })
        .catch((err) => {
            console.error('❌ Ошибка синхронизации таблиц:', err);
        });
    app.use((req, res, next) => {
        logger.info(`Request: ${req.method} ${req.url}`);
        next();
    });

    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/', (req, res) => {
        res.status(200).json({ message: 'ExtraSpace API работает!' });
    });

    app.get('/protected', authenticateJWT, (req, res) => {
        res.json({ message: 'Этот маршрут защищён!', user: req.user });
    });
    app.use('/auth', googleAuthRoutes);
    app.use('/auth', basicAuthRoutes);
    app.use('/storages', individualStorageRoutes);
    app.use('/warehouses', warehouseRoutes);
    app.use('/chats',authenticateJWT,chatRoutes)
    app.use('/users', userRoutes);
    app.use('/prices', priceRoutes);
    app.use('/faq', FAQRoutes);

    app.use((req, res) => {
        res.status(404).json({ error: 'Не найдено' });
    });
    app.use(errorHandler);

    return { app, server };
}

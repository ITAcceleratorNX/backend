import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from './config/passport.js';
import googleAuthRoutes from './routes/auth/google.js';
import basicAuthRoutes from './routes/auth/BasicAuthRouter.js';
import { authenticateJWT } from "./middleware/jwt.js";
import * as fs from "node:fs";
import * as yaml from "yaml";
import swaggerUi from "swagger-ui-express";
import individualStorageRoutes from "./routes/storage/StorageRoutes.js";
import warehouseRoutes from "./routes/warehouse/WarehouseRoutes.js";
import userRoutes from './routes/user/UserRoutes.js';
import cookieParser from 'cookie-parser';
import http from "http";
import { setWSS } from "./config/ws.js";
import logger from "./utils/winston/logger.js";
import {errorHandler} from "./middleware/errorHandler.js";
import chatRoutes from "./routes/chat/ChatRoutes.js";
import priceRoutes from "./routes/service/ServiceRoutes.js";
import FAQRoutes from "./routes/faq/FAQRoutes.js";
import {initDb, sequelize} from "./config/database.js";
import orderRoutes from "./routes/order/OrderRoutes.js";
import successPaymentCallback from "./routes/callbacks/PaymentCallback.router.js";
import notificationRoutes from "./routes/notification/notification.routes.js";
import cron from 'node-cron';
import { runMonthlyPayments } from './service/payment/paymentRecurrent.service.js';
import paymentRoutes from "./routes/payment/PaymentRoutes.js";
import {handleLateManualPayments, notifyManualPaymentsAfter10Days} from "./service/payment/paymentCheck.service.js";
import movingOrderRoutes from "./routes/moving/movingOrder.routes.js";
import orderServiceRoutes from "./routes/order_service/orderService.routes.js";
import {processCronJobForExpiredTransactions} from "./service/callback/PaymentCallback.service.js";
import {clearingRetryJob} from "./service/payment/clearing.service.js";
import {markOrdersWith10DaysLeftAsPending} from "./service/order/job/OrderJob.js";

export default async function appFactory() {
    await initDb();
    await sequelize.authenticate();
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
    app.use((req, res, next) => {
        logger.info('Incoming request', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            method: req.method,
        });
        next();
    });

    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/', (req, res) => {
        res.status(200).json({ message: 'ExtraSpace API работает!' });
    });


    cron.schedule('0 0 1 * *', () => {
        console.log('⏰ Запуск автооплаты...');
        runMonthlyPayments();
    });
    cron.schedule('0 10 * * *', () => {
        console.log('🔔 Проверка MANUAL оплат старше 10 дней...');
        notifyManualPaymentsAfter10Days();
    });
    cron.schedule('0 9 * * *', () => {
        console.log('🚨 Проверка просроченных оплат и штрафов...');
        handleLateManualPayments();
    });
    cron.schedule('*/5 * * * *', () => {
        console.log('🕒 Cron, проверка истекших оплат');
        processCronJobForExpiredTransactions();
    });
    cron.schedule("*/10 * * * *", async () => {
        await clearingRetryJob(); // каждые 10 минут
    });
    cron.schedule('0 */12 * * *', () => {
        console.log('Cron, проверка заканчивающихся броней');
        markOrdersWith10DaysLeftAsPending()
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
    app.use('/orders', orderRoutes);
    app.use('/notifications',authenticateJWT, notificationRoutes);
    app.use('/callbacks', successPaymentCallback);
    app.use('/payments', paymentRoutes);
    app.use('/moving',authenticateJWT, movingOrderRoutes)
    app.use('/order-services',authenticateJWT, orderServiceRoutes);
    app.use((req, res) => {
        res.status(404).json({ error: 'Не найдено' });
    });
    app.use(errorHandler);

    return { app, server };
}

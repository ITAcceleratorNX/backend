import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { sequelize } from "./config/database.js";
import BasicAuthRouter from "./routes/BasicAuthRouter.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", BasicAuthRouter);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Подключение к PostgreSQL установлено.");

        await sequelize.sync({ alter: true });
        console.log("✅ Модели синхронизированы с БД.");
    } catch (error) {
        console.error("❌ Ошибка при подключении:", error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== "test") {
    startServer();
}

export default app;
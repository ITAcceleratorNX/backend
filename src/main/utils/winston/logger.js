import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file"; // ПРАВИЛЬНЫЙ импорт

const logDirectory = process.env.LOG_DIR || 'logs';

const transport = new DailyRotateFile({
    filename: `${logDirectory}/%DATE%-combined.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '7d',
    level: 'info'
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        transport,
        new winston.transports.Console()
    ]
});

export default logger;

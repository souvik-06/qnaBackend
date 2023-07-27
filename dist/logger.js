"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const { createLogger, format, transports } = winston_1.default;
const { combine, printf } = format;
const getISTTimestamp = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} (IST)`;
    return formattedDateTime;
};
exports.logger = createLogger({
    format: combine(printf(({ level, message }) => {
        return `${getISTTimestamp()} ${level}: ${message}`;
    })),
    transports: [
        new transports.Console(), // Output logs to the console
        // new transports.File({ filename: "logs.log" }), // Output logs to a file
    ],
});
//# sourceMappingURL=logger.js.map
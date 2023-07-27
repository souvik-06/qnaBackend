"use strict";
// import dotenv from "dotenv";
// import express from "express";
// import cors from "cors";
// import { logger } from "./logger";
// import serverless from "serverless-http";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const app = express();
// app.use(cors({ credentials: true, origin: process.env.URL }));
// app.use("/profile", express.static("upload"));
// app.use(express.json());
// app.get("/", (req, res) => {
//   logger.info("API Working on port 5000");
//   res.send("API Working on port 5000 ");
// });
// const port = process.env.PORT || 5000;
// // https
// //   .createServer(
// //     // Provide the private and public key to the server by reading each
// //     // file's content with the readFileSync() method.
// //     {
// //       key: fs.readFileSync("key.pem"),
// //       cert: fs.readFileSync("cert.pem"),
// //     },
// //     app
// //   )
// //   .listen(port, () => {
// //     logger.info(`Server is running on https://localhost:${port}`);
// //   });
// app.listen(port, () => {
//   console.log(`App running on port ${port}!`);
// });
// export default serverless(app);
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8005;
app.use(express_1.default.json());
const allowedOrigins = [
    "https://d3pbkmrjaiyic6.cloudfront.net",
    "http://localhost:3000",
];
// Enable CORS with the allowed origins
const corsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Api for QuestionAnswers
const questionRoute_1 = __importDefault(require("./routes/questionRoute"));
app.use("/", questionRoute_1.default);
// UserInfo Working Api
const userRoute_1 = __importDefault(require("./routes/userRoute"));
app.use("/", userRoute_1.default);
// Start the servern
app.listen(port, () => {
    console.log(`App running on port ${port}!`);
});
module.exports.handler = (0, serverless_http_1.default)(app);
//# sourceMappingURL=app.js.map
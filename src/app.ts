// import dotenv from "dotenv";
// import express from "express";
// import cors from "cors";
// import { logger } from "./logger";
// import serverless from "serverless-http";

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

import express, { Express } from "express";
import cors from "cors";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8005;

app.use(express.json());
const allowedOrigins = [
  "https://d3pbkmrjaiyic6.cloudfront.net",
  "http://localhost:3000",
];

// Enable CORS with the allowed origins
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"], // Adjust the allowed HTTP methods as needed
  credentials: true,
};

app.use(cors(corsOptions));
// Api for QuestionAnswers
import questionRoutes from "./routes/questionRoute";
app.use("/", questionRoutes);

// UserInfo Working Api
import userRoutes from "./routes/userRoute";
app.use("/", userRoutes);

// Start the servern
app.listen(port, (): void => {
  console.log(`App running on port ${port}!`);
});
module.exports.handler = serverless(app);

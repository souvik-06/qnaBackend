import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { logger } from "./src/logger.js";

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: process.env.URL }));
app.use("/profile", express.static("upload"));
app.use(express.json());

app.get("/", (req, res) => {
  logger.info("API Working on port 5000");
  res.send("API Working on port 5000 ");
});

// Api for QuestionAnswers
import questionRoutes from "./src/routes/questionRoute.js";
app.use("/", questionRoutes);

// UserInfo Working Api
import userRoutes from "./src/routes/userRoute.js";
app.use("/", userRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});

export default app;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usersController from "./controllers/user.controller.js";
import router from "./route/index.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const app = express();

const limitter = rateLimit({
  windowMs: 16 * 60 * 1000,
  max: 150,
  message: "Too many requests",
  message: "too many requests",
});

app.use(express.json());
app.use(cookieParser());

app.use(helmet());
app.use(limitter);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(router);
app.use("/", usersController);

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to API",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

export default app;

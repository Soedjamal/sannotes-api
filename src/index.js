import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usersController from "./controllers/user.controller.js";
import router from "./route/index.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
dotenv.config();

const limitter = rateLimit({
  windowMs: 16 * 60 * 1000,
  max: 150,
  message: "to many request",
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.options("*", cors());
app.use(router);
app.use(helmet());
app.use(limitter);
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

export default app;

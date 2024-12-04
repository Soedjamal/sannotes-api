import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usersController from "./controllers/user.controller.js";
import router from "./route/index.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(router);

const port = process.env.PORT;

app.use("/", usersController);

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to API",
  });
});

app.listen(port, () => {
  console.log(`app running on http://localhost:${port}`);
});

export default app;

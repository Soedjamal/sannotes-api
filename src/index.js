import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import todosController from "./controllers/todos.controller.js";
import usersController from "./controllers/user.controller.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const port = 2007;

app.use("/", todosController);
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

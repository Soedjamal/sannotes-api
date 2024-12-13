import express from "express";
import {
  Login,
  Logout,
  RefreshToken,
  Register,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  completeTodoById,
  createTodoById,
  createTodoDescById,
  deleteTodoById,
  editTodoById,
  getAllTodos,
  getTodoByUserId,
} from "../controllers/todos.controller.js";
import { findUserByRefreshToken } from "../controllers/user.controller.js";

const router = express.Router();

// router.get("/todos", getAllTodos);
router.get("/todos", verifyToken, getTodoByUserId);
router.post("/todos/create", verifyToken, createTodoById);
router.patch("/todos/create/:id", verifyToken, createTodoDescById);
router.delete("/todos/delete/:id", verifyToken, deleteTodoById);
router.patch("/todos/edit/:id", verifyToken, editTodoById);
router.patch("/todos/complete/:id", verifyToken, completeTodoById);

router.get("/user", verifyToken, findUserByRefreshToken);

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/token", RefreshToken);

export default router;

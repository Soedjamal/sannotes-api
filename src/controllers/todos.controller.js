import todosRepository from "../repositories/todos.repository.js";
import express from "express";

const router = express.Router();

router.get("/todos", async (req, res, next) => {
  try {
    const todos = await todosRepository.findTodos();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({
      message: "cannot find users",
    });
    next(err);
  }
});

router.post("/todos", async (req, res, next) => {
  try {
    const todoData = req.body;
    const todo = await todosRepository.createTodo(todoData);
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({
      message: "cannot create todo",
    });
    next(err);
  }
});

router.delete("/todos/:id", async (req, res, next) => {
  try {
    const todoId = parseInt(req.params.id);
    const todo = await todosRepository.deleteTodo(todoId);
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({
      message: "cannot delete todo",
    });
    next(err);
  }
});

router.patch("/todos/:id", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const newTask = req.body;
    const user = await todosRepository.editTodo(userId, newTask);

    res.status(201).json(user);
  } catch (err) {
    res.status(403).json({
      message: "failed update todo",
    });
    next();
  }
});

export default router;

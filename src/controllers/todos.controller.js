import todosRepository from "../repositories/todos.repository.js";

export const getTodoByUserId = async (req, res, next) => {
  try {
    const id = req.id;
    const todos = await todosRepository.findTodoByUserId(id);
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({
      message: "cannot find users",
    });
    next(err);
  }
};

export const createTodoById = async (req, res, next) => {
  try {
    const id = req.id;
    const task = req.body;
    const todo = await todosRepository.createTodo(task, id);
    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json({
      message: "cannot create todo",
    });
    next(err);
  }
};

export const deleteTodoById = async (req, res, next) => {
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
};

export const editTodoById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { task } = req.body;

    const todo = await todosRepository.editTodo(id, task);

    res.status(201).json(todo);
  } catch (err) {
    res.status(403).json({
      message: "failed update todo",
    });
    next(err);
  }
};

export const completeTodoById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { completed } = req.body;

    const todo = await todosRepository.completeTodo(id, completed);

    res.status(201).json(todo);
  } catch (err) {
    res.status(403).json({
      message: "failed update todo",
    });
    next(err);
  }
};

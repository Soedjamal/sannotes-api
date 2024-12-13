import prisma from "../config/prisma.js";

const todosRepository = {
  findTodos: async () => {
    const todos = await prisma.todo.findMany();
    return todos;
  },

  findTodoByUserId: async (id) => {
    const todos = await prisma.todo.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return todos;
  },

  findTodoByUsername: async (username) => {
    const todos = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        todos: true,
      },
    });
    return todos;
  },

  createTodo: async (todoData, id) => {
    const todo = await prisma.todo.create({
      data: {
        task: todoData.task,
        userId: id,
      },
    });
    return todo;
  },

  createDesc: async (descData, id) => {
    const todos = await prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        taskDescription: descData,
      },
    });
    return todos;
  },

  deleteTodo: async (todoId) => {
    const todo = await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });
    return todo;
  },

  completeTodo: async (todoId, completedTodo) => {
    const todo = await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        completed: completedTodo,
      },
    });
    return todo;
  },

  editTodo: async (todoId, newTask) => {
    const todo = await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        task: newTask,
      },
    });
    return todo;
  },
};

export default todosRepository;

import prisma from "../config/prisma.js";

const todosRepository = {
  findTodos: async () => {
    const todos = await prisma.todo.findMany();
    return todos;
  },
  createTodo: async (todoData) => {
    const todo = await prisma.todo.create({
      data: {
        task: todoData.task,
        userId: todoData.userId,
      },
    });
    return todo;
  },
  deleteTodo: async (todoId) => {
    const todo = await prisma.todo.delete({
      where: {
        id: todoId,
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
        task: newTask.task,
      },
    });
    return todo;
  },
};

export default todosRepository;

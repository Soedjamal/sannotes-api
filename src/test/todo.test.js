import prisma from "../config/prisma.js";

function createTodos() {
  const todo = {
    id: 2,
    task: "!Belajar programming",
    userId: 2,
    completed: false,
  };
  const insertTodo = async () => {
    await prisma.todo.create({
      data: todo,
    });
  };
  insertTodo();
}

createTodos();

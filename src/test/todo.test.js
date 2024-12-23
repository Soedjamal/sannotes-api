import prisma from "../config/prisma.js";

async function createTodos() {
  const otp = await prisma.user.update({
    where: {
      email: "akmalihksan181@gmail.com",
    },
    data: {
      username: "akmal",
    },
  });
  return otp;
}

createTodos();

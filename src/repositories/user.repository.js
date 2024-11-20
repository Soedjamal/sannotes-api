import prisma from "../config/prisma.js";

const usersRepository = {
  findUsers: async () => {
    const users = await prisma.user.findMany();
    return users;
  },
  findUserByUsername: async (username) => {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        todos: true,
      },
    });
    return user;
  },
  createUser: async (userData) => {
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      },
    });
    return user;
  },
};

export default usersRepository;

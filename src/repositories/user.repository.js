import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { RefreshToken } from "../controllers/auth.controller.js";

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

  findUserByEmail: async (email) => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  },

  findUserByRToken: async (token) => {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: token,
      },
    });
    return user;
  },

  createUser: async (userData) => {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRound);

    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    });
    return user;
  },

  updateUsername: async (id, username) => {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
      },
    });
    return user;
  },

  updatePasswordByEmail: async (email, newPassword) => {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: newPassword,
      },
    });
    return user;
  },

  updateRefreshToken: async (id, refreshToken) => {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
    return user;
  },
  deleteRefreshToken: async (id) => {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        refreshToken: null,
      },
    });
    return user;
  },
  deleteUser: async (id) => {
    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return deleteUser;
  },
};

export default usersRepository;

import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

const otpRepository = {
  // findUsers: async () => {
  //   const users = await prisma.user.findMany();
  //   return users;
  // },
  //
  // findUserByUsername: async (username) => {
  //   const user = await prisma.user.findUnique({
  //     where: {
  //       username: username,
  //     },
  //     include: {
  //       todos: true,
  //     },
  //   });
  //   return user;
  // },
  //
  findOtpByEmail: async (email) => {
    const otpVerify = await prisma.otp.findUnique({
      where: {
        email: email,
      },
    });

    console.log(otpVerify);
    return otpVerify;
  },
  //
  // findUserByRToken: async (token) => {
  //   const user = await prisma.user.findFirst({
  //     where: {
  //       refreshToken: token,
  //     },
  //   });
  //   return user;
  // },

  createOtpByEmail: async (otpRand, email) => {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(otpRand, saltRound);

    const otp = await prisma.otp.upsert({
      where: {
        email: email,
      },
      update: {
        otp: hashedPassword,
        expiresAt: new Date(Date.now() + 7 * 60 * 1000),
      },
      create: {
        email: email,
        otp: hashedPassword,
        expiresAt: new Date(Date.now() + 7 * 60 * 1000),
      },
    });
    return otp;
  },

  // updateUsername: async (id, username) => {
  //   const user = await prisma.user.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       username: username,
  //     },
  //   });
  //   return user;
  // },
  //
  // updateRefreshToken: async (id, refreshToken) => {
  //   const user = await prisma.user.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       refreshToken: refreshToken,
  //     },
  //   });
  //   return user;
  // },
  // deleteRefreshToken: async (id) => {
  //   const user = await prisma.user.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       refreshToken: null,
  //     },
  //   });
  //   return user;
  // },
  deleteOtpByEmail: async (email) => {
    const deleteOtp = await prisma.otp.update({
      where: {
        email: email,
      },
      data: {
        otp: null,
      },
    });
    return deleteOtp;
  },
};

export default otpRepository;

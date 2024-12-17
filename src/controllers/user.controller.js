import express from "express";
import usersRepository from "../repositories/user.repository.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

export const findUserByRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  try {
    const user = await usersRepository.findUserByRToken(refreshToken);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "cannot find user",
    });
    next(err);
  }
};

router.get("/users", async (req, res, next) => {
  try {
    const user = await usersRepository.findUsers();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      message: "cannot find user",
    });
    next(err);
  }
});

router.delete("/user/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await usersRepository.deleteUser(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "cannot create user",
    });
    next(err);
  }
});

router.patch("/user/:id", verifyToken, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { username } = req.body;
    const user = await usersRepository.updateUsername(id, username);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "cannot update user",
    });
    next(err);
  }
});

router.post("/user", async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await usersRepository.createUser(userData);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "cannot create user",
    });
    next(err);
  }
});

export default router;

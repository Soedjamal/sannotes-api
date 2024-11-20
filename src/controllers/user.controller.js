import express from "express";
import usersRepository from "../repositories/user.repository.js";

const router = express.Router();

router.get("/user", async (req, res, next) => {
  const { username } = req.query;
  try {
    const user = await usersRepository.findUserByUsername(username);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "cannot create user",
    });
    next(err);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const user = await usersRepository.findUsers();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "cannot create user",
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

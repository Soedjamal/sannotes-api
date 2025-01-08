import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import usersRepository from "../repositories/user.repository.js";

// Register
export const Register = async (req, res) => {
  const requestUser = req.body;

  if (!requestUser.username) {
    return res.status(400).json({
      message: { username: "username wajib diisi" },
    });
  }

  if (!requestUser.email) {
    return res.status(400).json({
      message: { email: "email wajib diisi" },
    });
  }

  const existingUsername = await usersRepository.findUserByUsername(
    requestUser.username,
  );
  const existingEmail = await usersRepository.findUserByEmail(
    requestUser.email,
  );

  if (
    existingUsername?.username === requestUser.username ||
    existingEmail?.email === requestUser.email
  ) {
    return res.status(400).json({
      message: { all: "username atau email telah digunakan" },
    });
  }

  try {
    await usersRepository.createUser(requestUser);
    res.status(200).json({ message: { success: "register success" } });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Login
export const Login = async (req, res) => {
  const requestUser = req.body;

  if (!requestUser.username) {
    return res.status(400).json({
      message: { username: "username wajib diisi" },
    });
  }

  const currentUser =
    (await usersRepository.findUserByUsername(requestUser.username)) || "";

  if (currentUser.username !== requestUser.username) {
    return res
      .status(400)
      .json({ message: { username: "username belum terdaftar" } });
  }

  if (requestUser.password.length < 8) {
    return res.json({ message: "password minimal 8 karakter" });
  }

  const match = await bcrypt.compare(
    requestUser.password,
    currentUser.password,
  );

  if (!match) {
    return res
      .status(401)
      .json({ message: { password: "username atau password salah" } });
  }

  const jwtPayload = {
    id: currentUser.id,
    username: currentUser.username,
  };

  const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN, {
    expiresIn: "14d",
  });

  await usersRepository.updateRefreshToken(currentUser.id, refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: { success: "login success" },
    accessToken,
  });
};

// REFRESH TOKEN
export const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    const user = await usersRepository.findUserByRToken(refreshToken);

    if (!user) {
      return res.sendStatus(401);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      const jwtPayload = {
        id: user.id,
        username: user.username,
      };

      const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN, {
        expiresIn: "15m",
      });

      res.status(200).json({
        message: { success: "succes refresh token" },
        accessToken,
      });
    });
  } catch (err) {
    console.log(err);
  }
};

// LOGOUT
export const Logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const user = await usersRepository.findUserByRToken(refreshToken);

    if (!user) {
      return res.sendStatus(204);
    }

    await usersRepository.deleteRefreshToken(user.id);

    res.clearCookie("refreshToken");
    res.status(200).json({ success: "LoggedOut" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

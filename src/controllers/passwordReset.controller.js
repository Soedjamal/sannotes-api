import nodemailer from "nodemailer";
import usersRepository from "../repositories/user.repository.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import otpRepository from "../repositories/otp.repository.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export const createOtp = async (req, res) => {
  const { email } = req.body;

  const user = await usersRepository.findUserByEmail(email);

  if (!user) {
    return res.status(404).json("not valid email");
  }

  const otpRand = crypto.randomInt(100000, 999999).toString();

  await otpRepository.createOtpByEmail(otpRand, user.email);

  const mailOptions = {
    from: process.env.APP_EMAIL,
    to: user.email,
    subject: "SanNotes - Verifikasi Kode Ganti Password",
    text: `Jangan bagikan kode berikut kepada siapapun:\n\n${otpRand}\n\nJika Anda tidak meminta penggantian password, abaikan email ini.`,
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #0078d4; text-align: center;">SanNotes</h2>
    <p style="font-size: 16px; color: #333;">Halo ${user.email} 👋,</p>
    <p style="font-size: 16px; color: #333;">
      Anda telah meminta penggantian password untuk akun Anda di <b>SanNotes</b>. Gunakan kode verifikasi di bawah ini untuk melanjutkan proses ganti password:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 24px; font-weight: bold; color: #0078d4; background-color: #e6f4ff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
        ${otpRand}
      </span>
    </div>
    <p style="font-size: 14px; color: #666;">
      <b>Jangan bagikan kode ini kepada siapapun.</b> Jika Anda tidak meminta penggantian password, abaikan email ini. Akun Anda tetap aman.
    </p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="font-size: 12px; color: #999; text-align: center;">
      Email ini dikirim oleh <b>SanNotes</b>. Jika Anda memiliki pertanyaan, hubungi kami di <a href="mailto:${process.env.APP_EMAIL}" style="color: #0078d4;">support@sannotes.com</a>.
    </p>
  </div>
  `,
  };

  await transporter.sendMail(mailOptions);
  res.status(200).json({
    message: "Kode verifikasi telah dikirim, periksa email mu",
  });
};

export const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  const otpCode = await otpRepository.findOtpByEmail(email);

  console.log(req.body);

  const validOtp = await bcrypt.compare(otp, otpCode.otp);

  if (!validOtp) {
    return res.status(400).json({
      message: "kode verifikasi tidak valid",
    });
  }

  if (new Date() > otpCode.expiresAt) {
    return res.status(400).json({
      message: "kode verifikasi telah kadaluarsa",
    });
  }

  const jwtPayload = {
    id: otpCode.id,
    otp: otpCode.otp,
    email: otpCode.email,
  };

  const otpSession = jwt.sign(jwtPayload, process.env.PASSWORD_RESET_TOKEN, {
    expiresIn: "30m",
  });

  res.cookie("otpSessionToken", otpSession, {
    httpOnly: true,
    maxAge: 31 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.status(200).json({
    otpSessionToken: otpSession,
    message: "kode terverifikasi",
  });
};

export const resetPassword = async (req, res) => {
  const email = req.email;
  const { password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  await usersRepository.updatePasswordByEmail(email, hashPassword);

  await otpRepository.deleteOtpByEmail(email);

  res.clearCookie("otpSessionToken", {
    httpOnly: true,
  });

  res.status(200).json({
    message: "password beehasil diubah",
  });
};

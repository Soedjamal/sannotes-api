import jwt from "jsonwebtoken";

export const verifyOtpToken = async (req, res, next) => {
  const token = req.cookies.otpSessionToken;

  if (!token) {
    return res.status(401).json({
      message: "token is required",
    });
  }

  jwt.verify(token, process.env.PASSWORD_RESET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "invalid, lakukan verifikasi ulang",
      });
    }

    req.id = decoded.id;
    req.email = decoded.email;
    next();
  });
};

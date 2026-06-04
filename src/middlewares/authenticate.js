import { verifyAccessToken } from "../services/jwt.js";

export const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token!" });
    };
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  };
};
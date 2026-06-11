import jwt from "jsonwebtoken";

export const signAccessToken = (user) => {
  return jwt.sign({
    id: user._id,
    userNumber: user.userNumber
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d" // 7 days expiration
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify( token, process.env.JWT_SECRET );
};
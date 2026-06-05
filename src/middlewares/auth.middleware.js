import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // สมมติว่าใน token เก็บ userNumber ไว้
    req.user = { userNumber: decoded.userNumber }; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};
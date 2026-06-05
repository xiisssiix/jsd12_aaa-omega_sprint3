import { User } from "../modules/users/user.model.js";

export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      };
      if (!roles.includes(user.role)) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      };
      next();
    } catch (error) {
      next(error);
    };
  };
};
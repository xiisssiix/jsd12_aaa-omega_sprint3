import { User } from "./user.model.js";
import { signAccessToken } from "../../services/jwt.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/"
};

const userResponse = (doc) => {
  const user = doc.toObject();
  delete user.password;
  return user;
};

export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body || {};
    const trimmedEmail = String(email || "").trim().toLowerCase();
    if (!trimmedEmail || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    };
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    };
    if (password.length < PASSWORD_MIN) {
      return res.status(400).json({ success: false, error: `Password must be at least ${PASSWORD_MIN} characters` });
    };
    if (password.length > PASSWORD_MAX) {
      return res.status(400).json({ success: false, error: `Password must not exceed ${PASSWORD_MAX} characters` });
    };
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, error: "Email already exists" });
    };
    const user = await User.create({ firstName, lastName, phone, email: trimmedEmail, password });
    return res.status(201).json({ success: true, data: userResponse(user) });
  } catch (error) {
    next(error);
  };
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const trimmedEmail = String(email || "").trim().toLowerCase();
    if (!trimmedEmail || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    };
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    };
    const user = await User.findOne({ email: trimmedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    };
    if (!user.isActive) {
      return res.status(403).json({ success: false, error: "Account disabled" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    };

    user.lastLoginAt = new Date();
    await user.save();
    res.cookie("accessToken", signAccessToken(user), {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiration
    });
    return res.status(200).json({ success: true, data: userResponse(user) });
  } catch (error) {
    next(error);
  };
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", cookieOptions );
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  };
};

export const forgotPassword = async (req, res, next) => {
  // forgot Password
};

export const getMeProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    };
    return res.status(200).json({ success: true, data: userResponse(user) });
  } catch (error) {
    next(error);
  };
};

export const updateMeProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, company, taxId, phone, phone2, address, shippingAddress, serviceAddress } = req.body;
    const updates = Object.fromEntries(
      Object.entries({
        firstName, lastName, company, taxId, phone, phone2, address, shippingAddress, serviceAddress
      }).filter(([, value]) => value !== undefined)
    );
    const user = await User.findByIdAndUpdate(req.user.id, updates, { returnDocument: "after", runValidators: true });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    };
    return res.status(200).json({ success: true, data: userResponse(user) });
  } catch (error) {
    next(error);
  };
};

export const updateMePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    };
    if (!newPassword || !currentPassword) {
      return res.status(400).json({ success: false, error: "Current password and new password are required" });
    };
    if (newPassword === currentPassword) {
      return res.status(400).json({ success: false, error: `New password must be different from current password` });
    };
    if (newPassword.length < PASSWORD_MIN) {
      return res.status(400).json({ success: false, error: `Password must be at least ${PASSWORD_MIN} characters` });
    };
    if (newPassword.length > PASSWORD_MAX) {
      return res.status(400).json({ success: false, error: `Password must not exceed ${PASSWORD_MAX} characters` });
    };
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Current password incorrect" });
    };
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  };
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ userNumber: -1 });
    return res.status(200).json({ success: true, data: users.map(userResponse) });
  } catch (error) {
    next(error);
  };
};

export const getUserByNumber = async (req, res, next) => {
  try {
    const userNumber = Number(req.params.userNumber);
    if (Number.isNaN(userNumber)) {
      return res.status(400).json({ success: false, error: "Invalid user number" });
    };
    const user = await User.findOne({ userNumber });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    };
    return res.status(200).json({ success: true, data: userResponse(user) });
  } catch (error) {
    next(error);
  };
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    };
    return res.status(200).json({ success: true, data: userResponse(user) });
  } catch (error) {
    next(error);
  };
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, error: "Role is required" });
    };
    const allowedRoles = ["customer", "staff", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    };
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    };
    if (role === user.role) {
      return res.status(400).json({ success: false, error: `New role must be different from current role` });
    };
    user.role = role;
    await user.save();
    return res.status(200).json({ success: true, data: userResponse(user) });
  } catch (error) {
    next(error);
  };
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    };
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  };
};
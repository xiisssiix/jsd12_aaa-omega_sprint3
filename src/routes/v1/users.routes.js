import { Router } from "express";

import {
  registerUser, loginUser, logoutUser, /*forgotPassword,*/
  getMeProfile, updateMeProfile, updateMePassword,
  getUsers, getUserByNumber, getUserById,
  updateUserRole, deleteUser
} from "../../modules/users/users.v1.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

export const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser);
//router.post("/forgot-password", forgotPassword);

router.get("/profile", authenticate, getMeProfile);
router.put("/profile", authenticate, updateMeProfile);
router.patch("/profile/password", authenticate, updateMePassword);

router.get("/", authenticate, authorize("staff", "admin"), getUsers);
router.get("/number/:userNumber", authenticate, authorize("staff", "admin"), getUserByNumber);
router.get("/:id", authenticate, authorize("staff", "admin"), getUserById);

router.patch("/:id/role", authenticate, authorize("admin"), updateUserRole);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);
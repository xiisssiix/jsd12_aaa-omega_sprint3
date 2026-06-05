import { Router } from "express";
import { addToCart, getCart } from "../../modules/carts/carts.v1.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

export const router = Router();

router.post("/add", protect, addToCart); // ต้องล็อกอินก่อนถึงเพิ่มได้
router.get("/", protect, getCart);       // ต้องล็อกอินก่อนถึงดูตะกร้าได้
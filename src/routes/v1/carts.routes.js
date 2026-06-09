import { Router } from "express";
import { 
  addToCart, 
  getCart, 
  updateQuantity, 
  removeFromCart 
} from "../../modules/carts/carts.v1.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";

export const router = Router();

router.post("/add", authenticate, addToCart); // ต้องล็อกอินก่อนถึงเพิ่มได้
router.get("/", authenticate, getCart);       // ต้องล็อกอินก่อนถึงดูตะกร้าได้
router.put("/update", authenticate, updateQuantity); // อัปเดตจำนวนสินค้า
router.delete("/remove/:productNumber", authenticate, removeFromCart); // ลบสินค้า (ต้องส่ง productNumber ไปที่ URL)

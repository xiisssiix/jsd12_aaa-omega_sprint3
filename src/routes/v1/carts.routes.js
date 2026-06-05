import { Router } from "express";

import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart } from "../../modules/carts/carts.v1.controller.js";

export const router = Router();

router.get("/", getCart);
router.post("/items", addCartItem);
router.put("/items/:productNumber", updateCartItem);
router.delete("/items/:productNumber", removeCartItem);
//router.delete("/", clearCart);
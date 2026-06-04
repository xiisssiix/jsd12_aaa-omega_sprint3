import { Router } from "express";

import { getOrders, getOrderByNumber, getOrderById, createOrder, updateOrder, updateOrderStatus, updateOrderInternalNote, deleteOrder } from "../../modules/orders/orders.v1.controller.js";

export const router = Router();

router.get("/", getOrders);
router.get("/number/:orderNumber", getOrderByNumber);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/internal-note", updateOrderInternalNote);
router.delete("/:id", deleteOrder);
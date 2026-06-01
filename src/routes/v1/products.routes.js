import { Router } from "express";

import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../../modules/products/products.v1.controller.js";

export const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
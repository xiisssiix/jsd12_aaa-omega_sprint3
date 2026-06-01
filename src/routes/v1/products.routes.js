import { Router } from "express";

import { Product } from "../../modules/products/product.model.js";
import {
  getProducts,
  /*createProduct,
  updateProduct,
  deleteProduct,*/
} from "../../modules/products/products.v1.controller.js";

export const router = Router();

router.get("/", getProducts);

//router.post("/", createProduct);

//router.put("/:id", updateProduct);

//router.delete("/:id", deleteProduct);
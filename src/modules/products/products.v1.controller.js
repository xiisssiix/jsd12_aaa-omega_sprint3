import { Product } from "./product.model.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};
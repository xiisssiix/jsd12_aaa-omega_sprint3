import { Product } from "./product.model.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ productNumber: -1 });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  };
};

export const getProductByNumber  = async (req, res, next) => {
  try {
    const productNumber = Number(req.params.productNumber);
    if (Number.isNaN(productNumber)) {
      return res.status(400).json({ success: false, error: "Invalid product number" });
    };
    const product = await Product.findOne({ productNumber });
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    };
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  };
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    };
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  };
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  };
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    };
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  };
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    };
    return res.status(200).json({ success: true, data: product, message: "Product deleted" });
  } catch (error) {
    next(error);
  };
};
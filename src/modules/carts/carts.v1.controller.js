import { Cart } from "./cart.model.js";
import { Product } from "../products/product.model.js";

// ฟังก์ชันเพิ่มสินค้าลงตะกร้า
export const addToCart = async (req, res) => {
  const { productNumber, quantity } = req.body;
  const { userNumber } = req.user; // ได้มาจาก auth.middleware

  try {
    let cart = await Cart.findOne({ userNumber });

    if (cart) {
      // ตะกร้ามีอยู่แล้ว เช็กว่ามีสินค้านี้หรือยัง
      const itemIndex = cart.items.findIndex(i => i.productNumber === productNumber);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity; // มีแล้วให้บวกจำนวนเพิ่ม
      } else {
        cart.items.push({ productNumber, quantity }); // ยังไม่มีให้เพิ่มเข้าไปใหม่
      }
    } else {
      // ถ้ายังไม่มีตะกร้า ให้สร้างใหม่เลย
      cart = new Cart({ userNumber, items: [{ productNumber, quantity }] });
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ฟังก์ชันดึงข้อมูลตะกร้าสินค้า
export const getCart = async (req, res) => {
  try {
    const { userNumber } = req.user;
    const cart = await Cart.findOne({ userNumber }).lean();

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ items: [], total: 0 });
    }

    const productNumbers = cart.items.map(item => item.productNumber);
    const products = await Product.find({ productNumber: { $in: productNumbers } });

    const detailedItems = cart.items.map(item => {
      const product = products.find(p => p.productNumber === item.productNumber);
      return {
        ...item,
        name: product?.name,
        price: product?.salePrice || product?.price,
        image: product?.image?.url
      };
    });

    const total = detailedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({ items: detailedItems, total });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};
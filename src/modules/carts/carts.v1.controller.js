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

// ฟังก์ชันอัปเดตจำนวนสินค้า
export const updateQuantity = async (req, res) => {
  const { productNumber, quantity } = req.body;
  const { userNumber } = req.user;

  try {
    // ป้องกันการส่งจำนวนติดลบหรือเป็น 0
    if (quantity <= 0) {
      return res.status(400).json({ message: "จำนวนสินค้าต้องมากกว่า 0" });
    }

    const cart = await Cart.findOne({ userNumber });
    
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    const itemIndex = cart.items.findIndex(i => i.productNumber === productNumber);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity; // อัปเดตจำนวนใหม่แทนที่ของเดิม
      await cart.save();
      return res.status(200).json({ message: "อัปเดตจำนวนสินค้าสำเร็จ", cart });
    } else {
      return res.status(404).json({ message: "ไม่พบสินค้านี้ในตะกร้า" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ฟังก์ชันลบสินค้าออกจากตะกร้า
export const removeFromCart = async (req, res) => {
  // รับค่า productNumber มาจาก URL Parameter
  const { productNumber } = req.params; 
  const { userNumber } = req.user;

  try {
    const cart = await Cart.findOne({ userNumber });
    
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    // ใช้ filter เพื่อเก็บเฉพาะสินค้าที่ productNumber ไม่ตรงกับที่กดลบ
    cart.items = cart.items.filter(i => i.productNumber !== parseInt(productNumber));
    await cart.save();

    res.status(200).json({ message: "ลบสินค้าออกจากตะกร้าสำเร็จ", cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ฟังก์ชันล้างสินค้าทั้งหมดในตะกร้า (ลบแค่รายการ แต่เก็บตะกร้าไว้)
export const clearCart = async (req, res) => {
  const { userNumber } = req.user; // ดึง userNumber มาจาก auth.middleware เหมือนเดิม

  try {
    const cart = await Cart.findOne({ userNumber });
    
    if (!cart) {
      // ถ้าไม่พบตะกร้า ก็ถือว่าตะกร้าว่างอยู่แล้ว ส่ง status 200 กลับไปได้เลย
      return res.status(200).json({ message: "ตะกร้าสินค้าว่างอยู่แล้ว", items: [] });
    }

    // เซ็ตให้ items กลายเป็น Array ว่าง (เคลียร์สินค้าออกทั้งหมด)
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "ล้างตะกร้าสินค้าสำเร็จ", cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
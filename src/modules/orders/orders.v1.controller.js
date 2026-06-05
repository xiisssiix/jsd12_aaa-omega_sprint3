import { Order } from "./order.model.js";

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ orderNumber: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  };
};

export const getOrderByNumber  = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    };
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  };
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    };
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  };
};

export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  };
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    };
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  };
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { returnDocument: "after", runValidators: true });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderInternalNote = async (req, res, next) => {
  try {
    const { internalNote } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { internalNote }, { returnDocument: "after", runValidators: true });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    };
    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  };
};
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userNumber:{ type:Number, unique:true, immutable:true, index:true },
  items:[{
    productNumber:{ type:Number, required:true, index:true },
    quantity:{ type:Number, required:true, min:1 }
  }],
}, {
  timestamps:true
});

export const Cart = mongoose.model("Cart", cartSchema);
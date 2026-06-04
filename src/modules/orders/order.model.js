import mongoose from "mongoose";

import { getNextSequence } from "../counters/counter.service.js";

const orderSchema = new mongoose.Schema({
  orderNumber:{ type:String, unique:true, immutable:true, index:true },
  totalPrice:{ type:Number, required:true, min:0 },
  paymentMethod:{ type:String, enum:["bank_transfer", "cash", "card", "qr"], default:"bank_transfer" },
  status:{ type:String, enum:["open", "paid", "preparing", "shipping", "delivered", "cancelled"], default:"open", index:true},
  items:[{
    productNumber: { type:Number, required:true, index:true },
    name: { type:String, trim:true, maxlength:200 },
    sku: { type:String, trim:true, lowercase:true, index:true },
    priceAtPurchase:{ type:Number, min:0 },
    quantity:{ type:Number, required:true, min:1 }
  }],
  orderNote:{ type:String, trim:true, default:"" },
  internalNote:{ type:String, trim:true, default:"" },
  customer:{
    userNumber:{ type:Number, index:true },
    firstName:{ type:String, trim:true, maxlength:200 },
    lastName:{ type:String, trim:true, maxlength:200 },
    company:{ type:String, trim:true, default:null, maxlength:200 },
    taxId:{ type:String, default:null },
    phone:{ type:String, index:true },
    phone2:{ type:String, default:null, index:true },
    email:{ type:String, index:true },
    shippingAddress:{
      label:{ type:String, trim:true },
      addressLine:{ type:String, required:true, trim:true },
      subdistrict:{ type:String, trim:true },
      district:{ type:String, trim:true },
      province:{ type:String, trim:true },
      postcode:{ type:String }
    }
  }
}, {
  timestamps:true
});

orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const seq = await getNextSequence(`order_${year}`);
    this.orderNumber = `ord${year}${String(seq).padStart(4, "0")}`;
  };
});

export const Order = mongoose.model("Order", orderSchema);
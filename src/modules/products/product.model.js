import mongoose from "mongoose";

import { getNextSequence } from "../counters/counter.service.js";

const productSchema = new mongoose.Schema({
  productNumber: { type:Number, unique:true, immutable:true, index:true },
  name: { type:String, required:true, trim:true, maxlength:200 },
  sku: { type:String, required:true, unique:true, index:true, trim:true, lowercase:true },
  brand: { type:String },
  category: { type:String, required:true },
  warranty: { type:Number, required:true },
  description: { type:String, trim:true, maxlength:4000 },
  specs: {
    type: [
      {
        label: { type:String, trim:true, },
        value: { type:String, trim:true, }
      }
    ],
    default: []
  },
  features: { type:[String], trim:true, default:[] },
  image: {
    url: { type:String },
    cloudinaryId: { type:String }
  },
  gallery: [
    {
      url: { type:String },
      cloudinaryId: { type:String }
    }
  ],
  tags: { type:[String], maxlength:200, default:[] },
  price: { type:Number, required:true, min:0 },
  salePrice: { type:Number, min:0, default:null },
  stock: { type:Number, required:true, min:0 },
  stockMin: { type:Number, min:0, default:0 },
  isActive: { type:Boolean, default:true, index:true }
}, {
  timestamps:true
});

productSchema.pre("save", async function () {
  if (this.productNumber == null) {
    this.productNumber = await getNextSequence("product");
  };
});

export const Product = mongoose.model("Product", productSchema);
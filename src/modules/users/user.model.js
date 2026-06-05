import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { getNextSequence } from "../counters/counter.service.js";

const userSchema = new mongoose.Schema({
  userNumber:{ type:Number, unique:true, immutable:true, index:true },
  firstName:{ type:String, trim:true, maxlength:200 },
  lastName:{ type:String, trim:true, maxlength:200 },
  company:{ type:String, trim:true, maxlength:200 },
  taxId:{ type:String },
  phone:{ type:String, index:true },
  phone2:{ type:String, index:true },
  email:{ type:String, unique:true, required:true, lowercase:true, trim:true, index:true },
  password: { type:String, required:true, minlength:8, maxlength:72, select:false },
  role:{ type:String, enum:["customer", "staff", "admin"], default:"customer", index:true },
  isActive:{ type:Boolean, default:true, index:true },
  address:{
    label:{ type:String },
    addressLine:{ type:String, trim:true },
    subdistrict:{ type:String, trim:true },
    district:{ type:String, trim:true },
    province:{ type:String, trim:true },
    postcode:{ type:String },
    isDefault:{ type:Boolean }
  },
  shippingAddress:{
    label:{ type:String },
    addressLine:{ type:String, trim:true },
    subdistrict:{ type:String, trim:true },
    district:{ type:String, trim:true },
    province:{ type:String, trim:true },
    postcode:{ type:String },
    isDefault:{ type:Boolean }
  },
  serviceAddress:{
    label:{ type:String },
    addressLine:{ type:String, trim:true },
    subdistrict:{ type:String, trim:true },
    district:{ type:String, trim:true },
    province:{ type:String, trim:true },
    postcode:{ type:String },
    isDefault:{ type:Boolean }
  },
  lastLoginAt: { type:Date }
}, {
  timestamps:true
});

// Use .create() or .save()
userSchema.pre("save", async function () {
  if (this.userNumber == null) {
    this.userNumber = await getNextSequence("user");
  };

  if (!this.isModified("password")) return;

  const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
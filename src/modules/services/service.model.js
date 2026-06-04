import mongoose from "mongoose";

import { getNextSequence } from "../counters/counter.service.js";

const serviceSchema = new mongoose.Schema({
  serviceNumber:{ type:String, unique:true, immutable:true, index:true },
  orderNumber:{ type:String, index:true },
  serviceType:{ type:String, required:true, enum:["install", "clean", "maintenance"] },
  appointmentAt:{ type:String, required:true },
  team:{ type:String, default:null },
  status:{ type:String, enum:["request_received", "scheduled", "in_progress", "completed", "rescheduled", "cancelled"], default:"request_received", index:true},
  title:{ type:String, trim:true, maxlength:200 },
  description:{ type:String, trim:true, maxlength:4000 },
  images: [
    {
      url: { type:String },
      cloudinaryId: { type:String }
    }
  ],
  internalNote:{ type:String, trim:true, default:"" },
  customer:{
    userNumber:{ type:Number, index:true },
    firstName:{ type:String, required:true, trim:true, maxlength:200 },
    lastName:{ type:String, required:true, trim:true, maxlength:200 },
    company:{ type:String, trim:true, default:null, maxlength:200 },
    taxId:{ type:String, default:null },
    phone:{ type:String, required:true, index:true },
    phone2:{ type:String, default:null, index:true },
    email:{ type:String, index:true },
    serviceAddress:{
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

serviceSchema.pre("save", async function () {d
  if (!this.serviceNumber) {
    const year = new Date().getFullYear();
    const seq = await getNextSequence(`service_${year}`);
    this.serviceNumber = `sv${year}${String(seq).padStart(4, "0")}`;
  }
});

export const Service = mongoose.model("Service", serviceSchema);
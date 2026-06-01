import mongoose from "mongoose";

export let mongoStatus = "Disconnected";

export async function connectMongoDb() {

  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri, { dbName: "solarcell-ecommerce" });
    mongoStatus = "Connected";
    console.log("MongoDB connected");
  } catch (error) {
    mongoStatus = "Error";
    console.error("MongoDB connection error", error);
    throw error;
  };

};
import { v2 as cloudinary } from "cloudinary";

export let cloudinaryStatus = "Disconnected";

export async function connectCloudinary() {

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const res = await cloudinary.api.ping();
    cloudinaryStatus = "Connected";
    console.log(`Cloudinary connected: ${res.status}`);
  } catch (error) {
    cloudinaryStatus = "Error";
    console.error("Cloudinary connection error", error);
    throw error;
  };

};
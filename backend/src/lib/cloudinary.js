import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import path from "path";

const envPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(process.cwd(), "backend/.env")
    : path.resolve(process.cwd(), ".env");

config({ path: envPath }); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

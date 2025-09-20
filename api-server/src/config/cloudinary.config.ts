import { v2 as cloudinary } from "cloudinary";
import envConfig from "./env.config";

cloudinary.config({
  cloud_name: envConfig.CLOUD_NAME_CLOUDINARY,
  api_key: envConfig.API_KEY_CLOUDINARY,
  api_secret: envConfig.API_SECRET_CLOUDINARY,
});

export default cloudinary;

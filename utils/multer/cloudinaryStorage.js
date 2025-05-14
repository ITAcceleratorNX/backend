import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // БҰЛ БОЛМАСА — SIGNATURE ERROR
});

export const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "extraspace", // ✅ тек осы!
    },
});

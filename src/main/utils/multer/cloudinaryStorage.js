import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        console.log("📸 Filename:", file.originalname);
        const originalName = file.originalname.replace(/\.[^/.]+$/, "");
        const safeName = originalName.replace(/[^a-zA-Z0-9_-]/g, "");

        return {
            folder: "extraspace",
            public_id: safeName,
            resource_type: "image",
        };
    }
});
import multer from "multer";
import { cloudinaryStorage } from "../utils/multer/cloudinaryStorage.js";

export const upload = multer({ storage: cloudinaryStorage });

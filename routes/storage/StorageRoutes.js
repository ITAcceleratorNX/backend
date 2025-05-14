import express from "express";
import * as storageController from "../../controllers/storage/StorageController.js";
import { upload } from "../../middleware/multerMiddleware.js";

const router = express.Router();

router.post("/", upload.single("image"), storageController.createStorage);
router.get("/", storageController.getAllStorages);
router.get("/:id", storageController.getStorageById);
router.put("/:id", storageController.updateStorage);
router.delete("/:id", storageController.deleteStorage);

export default router;

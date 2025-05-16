import express from "express";
import {validateBody} from "../../middleware/validate.js";
import {StorageDto, UpdateStorageDto} from "../../dto/storage/Storage.dto.js";
import * as storageController from "../../controllers/storage/StorageController.js";
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";

const router = express.Router();

router.get("/", storageController.getAllStorages);
router.get("/:id", storageController.getStorageById);
router.post("/", authenticateJWT, authorizeAdminOrManager, validateBody(StorageDto), storageController.createStorage);
router.delete("/:id", authenticateJWT ,authorizeAdminOrManager, storageController.deleteStorage);
router.put("/:id", authenticateJWT, authorizeAdminOrManager, validateBody(UpdateStorageDto), storageController.updateStorage);

export default router;
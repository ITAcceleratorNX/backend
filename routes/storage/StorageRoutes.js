import express from "express";
import {validateBody} from "../../middleware/validate.js";
import {StorageDto, UpdateStorageDto} from "../../dto/storage/Storage.dto.js";
import * as storageController from "../../controllers/storage/StorageController.js";
import {authenticateJWT, authorizeAdmin} from "../../middleware/jwt.js";

const router = express.Router();

router.get("/", storageController.getAllStorages);
router.get("/:id", storageController.getStorageById);
router.post("/", authorizeAdmin, validateBody(StorageDto), storageController.createStorage);
router.delete("/:id", authorizeAdmin, storageController.deleteStorage);
router.put("/:id", authorizeAdmin, validateBody(UpdateStorageDto), storageController.updateStorage);

export default router;
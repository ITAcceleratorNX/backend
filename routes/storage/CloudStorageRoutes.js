import express from "express";
import CloudStorageController from "../../controllers/storage/CloudStorageController.js";
import { validateBody } from "../../middleware/validate.js";
import { CloudStorageDto, UpdateCloudStorageDto } from "../../dto/storage/CloudStorage.dto.js";

const router = express.Router();

router.get('', CloudStorageController.getAllCloud);
router.get('/:id', CloudStorageController.getCloudById);
router.post('', validateBody(CloudStorageDto), CloudStorageController.createCloud);
router.put('/:id', validateBody(UpdateCloudStorageDto), CloudStorageController.updateCloud);
router.delete('/:id', CloudStorageController.deleteCloud);

export default router;
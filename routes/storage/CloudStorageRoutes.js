import express from "express";
import CloudStorageController from "../../controllers/storage/CloudStorageController.js";
import { validateBody } from "../../middleware/validate.js";
import { CloudStorageDto, UpdateCloudStorageDto } from "../../dto/storage/CloudStorage.dto.js";
import authenticateJWT from '../../middleware/jwt.js';


const router = express.Router();


router.get('', authenticateJWT, CloudStorageController.getAllCloud);
router.get('/:id', authenticateJWT, CloudStorageController.getCloudById);
router.post('', authenticateJWT, validateBody(CloudStorageDto), CloudStorageController.createCloud);
router.put('/:id', authenticateJWT, validateBody(UpdateCloudStorageDto), CloudStorageController.updateCloud);
router.delete('/:id', authenticateJWT, CloudStorageController.deleteCloud);
export default router;
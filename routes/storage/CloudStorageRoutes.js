import express from "express";
import CloudStorageController from "../../controllers/storage/CloudStorageController.js";
const router = express.Router();
router.get('', CloudStorageController.getAllCloud);
router.get('/:id', CloudStorageController.getCloudById);
router.post('', CloudStorageController.createCloud);
router.put('/:id', CloudStorageController.updateCloud);
router.delete('/:id', CloudStorageController.deleteCloud);
export default router;
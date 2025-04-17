import express from "express";
import * as storageController from "../../service/storage/CloudStorageService.js";
const router = express.Router();
router.get('/cloud', CloudStorageController.getAllCloud);
router.get('/cloud/:id', CloudStorageController.getCloudById);
router.post('/cloud', CloudStorageController.createCloud);
router.put('/cloud/:id', CloudStorageController.updateCloud);
router.delete('/cloud/:id', CloudStorageController.deleteCloud);
export default router;
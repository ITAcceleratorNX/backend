import express from "express";
import * as storageController from "../../service/storage/CloudStorageService.js";
const router = express.Router();
router.get('/cloud', storageController.getAllCloud);
router.get('/cloud/:id', storageController.getCloudById);
router.post('/cloud', storageController.createCloud);
router.put('/cloud/:id', storageController.updateCloud);
router.delete('/cloud/:id', storageController.deleteCloud);
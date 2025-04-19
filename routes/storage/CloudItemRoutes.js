import express from 'express';
import {
    getItems,
    getItem,
    createNewItem,
    updateExistingItem,
    deleteExistingItem
} from '../../controllers/storage/CloudItemController.js';
import { validateBody } from "../../middleware/validate.js";
import { CloudItemDto, UpdateCloudItemDto } from "../../dto/storage/CloudItem.dto.js";
import authenticateJWT from '../../middleware/jwt.js';
const router = express.Router();

// ✅ тек токенмен кіргендер ғана көре алады:
router.get('/', authenticateJWT, getItems);
router.get('/:id', authenticateJWT, getItem);
router.post('/', authenticateJWT, validateBody(CloudItemDto), createNewItem);
router.put('/:id', authenticateJWT, validateBody(UpdateCloudItemDto), updateExistingItem);
router.delete('/:id', authenticateJWT, deleteExistingItem);
export default router;
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

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', validateBody(CloudItemDto), createNewItem);
router.put('/:id', validateBody(UpdateCloudItemDto), updateExistingItem);
router.delete('/:id', deleteExistingItem);

export default router;
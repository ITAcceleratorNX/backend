import express from 'express';
import {
    getItems,
    getItem,
    createNewItem,
    updateExistingItem,
    deleteExistingItem
} from '../../controllers/storage/CloudItemController.js';
import {validateBody} from "../../middleware/validate.js";
import {CloudItemDto, CloudItemUpdateDto} from "../../dto/storage/CloudItem.dto.js";

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/',validateBody(CloudItemDto), createNewItem);
router.put('/:id', updateExistingItem);
router.delete('/:id',validateBody(CloudItemUpdateDto), deleteExistingItem);

export default router;

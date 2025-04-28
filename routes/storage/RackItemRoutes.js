import express from 'express';
import {
    createItem, getAllItems, getItemById, updateItem, deleteItem, getItemsByRackId
} from '../../controllers/storage/RackItemController.js';
import { validateBody } from '../../middleware/validate.js';
import { RackItemDto, RackItemUpdateDto } from '../../dto/storage/RackItem.dto.js';

const router = express.Router();

router.post('/', validateBody(RackItemDto), createItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.put('/:id', validateBody(RackItemUpdateDto), updateItem);
router.delete('/:id', deleteItem);
router.get('/rack/:rack_id', getItemsByRackId);

export default router;

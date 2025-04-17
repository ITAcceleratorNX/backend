import express from 'express';
import {
    getItems,
    getItem,
    createNewItem,
    updateExistingItem,
    deleteExistingItem
} from '../../controllers/storage/CloudItemController.js';

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', createNewItem);
router.put('/:id', updateExistingItem);
router.delete('/:id', deleteExistingItem);

export default router;

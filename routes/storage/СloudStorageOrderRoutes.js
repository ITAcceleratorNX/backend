import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} from '../../controllers/storage/СloudStorageOrderController.js';
import {validateBody} from "../../middleware/validate.js";
import {CloudStorageOrderDto, CloudStorageOrderUpdateDto} from "../../dto/storage/CloudStorageOrder.dto.js";

const router = express.Router();

router.post('',validateBody(CloudStorageOrderDto), createOrder);
router.get('', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id',validateBody(CloudStorageOrderUpdateDto), updateOrder);
router.delete('/:id', deleteOrder);

export default router;

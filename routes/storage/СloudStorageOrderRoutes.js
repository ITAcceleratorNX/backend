import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} from '../../controllers/storage/СloudStorageOrderController.js';
import { validateBody } from "../../middleware/validate.js";
import { CloudStorageOrderDto, UpdateCloudStorageOrderDto } from "../../dto/storage/CloudStorageOrder.dto.js";
import authenticateJWT from '../../middleware/jwt.js';

const router = express.Router();

router.post('', authenticateJWT, validateBody(CloudStorageOrderDto), createOrder);
router.get('', authenticateJWT, getAllOrders);
router.get('/:id', authenticateJWT, getOrderById);
router.put('/:id', authenticateJWT, validateBody(UpdateCloudStorageOrderDto), updateOrder);
router.delete('/:id', authenticateJWT, deleteOrder);
export default router;
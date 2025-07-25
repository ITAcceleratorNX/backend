import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder, getOrderByStatus, getDeliveredOrders, getMyMovings
} from '../../controllers/moving/movingOrder.controller.js';
import {downloadItemDoc} from "../../utils/docx/downloadItemDoc.js";
import {authenticateJWT} from "../../middleware/jwt.js";

const router = express.Router();

router.post('/', authenticateJWT, createOrder);
router.get('/', authenticateJWT, getAllOrders);
router.get('/:id', authenticateJWT, getOrderById);
router.put('/:id', authenticateJWT, updateOrder);
router.delete('/:id', authenticateJWT, deleteOrder);
router.get('/status/:status', authenticateJWT, getOrderByStatus);
router.get('/orders/delivered', authenticateJWT, getDeliveredOrders);
router.get("/download/item/:itemId", downloadItemDoc);
router.get('/me/all', authenticateJWT, getMyMovings);

export default router;

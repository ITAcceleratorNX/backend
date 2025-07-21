import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder, getOrderByStatus, getDeliveredOrders
} from '../../controllers/moving/movingOrder.controller.js';
import {downloadItemDoc} from "../../utils/docx/downloadItemDoc.js";

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/status/:status', getOrderByStatus);
router.get('/orders/delivered', getDeliveredOrders);
router.get("/download/item/:itemId", downloadItemDoc);
export default router;

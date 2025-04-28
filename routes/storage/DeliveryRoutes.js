import express from 'express';
import { requestDelivery } from '../../controllers/storage/DeliveryController.js';
import { authenticateJWT } from '../../middleware/jwt.js'; // авторизация міндетті болса

const router = express.Router();

router.post('/', authenticateJWT, requestDelivery);

export default router;

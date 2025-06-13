import express from 'express';
import { handlePaymentCallback } from '../../controllers/callback/PaymentCallback.controller.js';
import {base64Decoder} from "../../middleware/decode_base_64.js";

const router = express.Router();
router.post('/payment-callback', base64Decoder, handlePaymentCallback);

export default router;

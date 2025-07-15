import express from "express";
import {validateBody} from "../../middleware/validate.js";
import {OrderPaymentDto, PaymentDto} from "../../dto/payment/Payment.dto.js";
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";
import * as paymentController from "../../controllers/payment/PaymentController.js";

const router = express.Router();

router.get("/me", authenticateJWT, paymentController.getMyPayments);
router.get("/users/:id", authenticateJWT, authorizeAdminOrManager, paymentController.getUserPayments);
router.post("/", authenticateJWT, validateBody(PaymentDto), paymentController.createPayment);
router.post('/manual', authenticateJWT, validateBody(OrderPaymentDto), paymentController.manualPayment);
router.get('/:order_payment_id/receipt', paymentController.getReceiptByOrder)

export default router;
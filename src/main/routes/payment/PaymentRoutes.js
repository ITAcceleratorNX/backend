import express from "express";
import {validateBody} from "../../middleware/validate.js";
import { PaymentDto } from "../../dto/payment/Payment.dto.js";
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";
import * as paymentController from "../../controllers/payment/PaymentController.js";

const router = express.Router();

router.get("/me", authenticateJWT, paymentController.getMyPayments);
router.get("/users/:id", authenticateJWT, authorizeAdminOrManager, paymentController.getUserPayments);
router.post("/", authenticateJWT, validateBody(PaymentDto), paymentController.createPayment);

export default router;
import express from "express";
import * as orderController from "../../controllers/order/OrderController.js";
import {validateBody} from "../../middleware/validate.js";
import {OrderDto, ApproveOrderDto, OrderUpdateDto} from "../../dto/order/Order.dto.js";
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";

const router = express.Router();

router.get("/", authenticateJWT, authorizeAdminOrManager, orderController.getAllOrders);
router.get("/me", authenticateJWT, orderController.getMyOrders);
router.get("/:id", authenticateJWT, orderController.getOrderById);
router.post("/", authenticateJWT, validateBody(OrderDto), orderController.createOrder);
router.put("/me", authenticateJWT, validateBody(OrderUpdateDto), orderController.updateOrder);
router.put("/:id/status", authenticateJWT, authorizeAdminOrManager, validateBody(ApproveOrderDto), orderController.approveOrder);
router.delete("/:id", authenticateJWT, authorizeAdminOrManager, orderController.deleteOrder);
router.put("/:id/cancel", authenticateJWT, orderController.cancelOrder);
// router.post("/extend", authenticateJWT, orderController.extendOrder);

export default router;
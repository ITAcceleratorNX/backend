import express from "express";
import * as orderController from "../../controllers/order/OrderController.js";
import {validateBody} from "../../middleware/validate.js";
import {OrderDto, OrderUpdateDto, ExtendedOrderDto} from "../../dto/order/Order.dto.js";
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";

const router = express.Router();

router.get("/", authenticateJWT, authorizeAdminOrManager, orderController.getAllOrders);
router.get("/me", authenticateJWT, orderController.getMyOrders);
router.get("/contracts", authenticateJWT, orderController.getMyContracts);
router.get("/items/:id", authenticateJWT, orderController.getItemsByOrderId);
router.get("/:id", authenticateJWT, orderController.getOrderById);
router.post("/", authenticateJWT, validateBody(OrderDto), orderController.createOrder);
router.put("/:id", authenticateJWT, validateBody(OrderUpdateDto), orderController.updateOrder);
router.delete("/:id", authenticateJWT, authorizeAdminOrManager, orderController.deleteOrder);
router.put("/:id/cancel", authenticateJWT, orderController.cancelOrder);
router.post("/extend", authenticateJWT, validateBody(ExtendedOrderDto), orderController.extendOrder);

export default router;
import express from "express";
import * as priceController from "../../controllers/price/PriceController.js";
import {validateBody} from "../../middleware/validate.js";
import { PriceDto, UpdatePriceDto} from "../../dto/price/Pirce.dto.js";
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";

const router = express.Router();

router.get("/", priceController.getAllPrices);
router.get("/:type", priceController.getPriceByType);
router.post("/", authenticateJWT, authorizeAdminOrManager, validateBody(PriceDto), priceController.createPrice);
router.put("/:id", authenticateJWT, authorizeAdminOrManager, validateBody(UpdatePriceDto), priceController.updatePrice);
router.delete("/:id", authenticateJWT, authorizeAdminOrManager, priceController.deletePrice);

export default router;
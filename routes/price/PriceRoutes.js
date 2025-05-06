import express from "express";
import * as priceController from "../../controllers/price/PriceController.js";
import {validateBody} from "../../middleware/validate.js";
import {CalculatePriceDto, PriceDto, UpdatePriceDto} from "../../dto/price/Pirce.dto.js";
import {authenticateJWT, authorizeAdmin} from "../../middleware/jwt.js";

const router = express.Router();

router.get("/", priceController.getAllPrices);
// router.get("/:id", priceController.getPriceById);
router.post("/", authenticateJWT, authorizeAdmin, validateBody(PriceDto), priceController.createPrice);
router.put("/:id", authenticateJWT, authorizeAdmin, validateBody(UpdatePriceDto), priceController.updatePrice);
router.delete("/:id", authenticateJWT, authorizeAdmin, priceController.deletePrice);
router.get("/cost", validateBody(CalculatePriceDto), priceController.calculatePrice)

export default router;
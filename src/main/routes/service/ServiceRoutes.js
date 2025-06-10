import express from "express";
import * as priceController from "../../controllers/service/ServiceController.js";
import {validateBody} from "../../middleware/validate.js";
import { ServiceDto, UpdateServiceDto} from "../../dto/serivce/Service.dto.js";
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";

const router = express.Router();

router.get("/", priceController.getAllServices);
router.get("/:type", priceController.getServiceByType);
router.post("/", authenticateJWT, authorizeAdminOrManager, validateBody(ServiceDto), priceController.createService);
router.put("/:id", authenticateJWT, authorizeAdminOrManager, validateBody(UpdateServiceDto), priceController.updateService);
router.delete("/:id", authenticateJWT, authorizeAdminOrManager, priceController.deleteService);

export default router;
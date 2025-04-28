import express from "express";
import RackStorageController from "../../controllers/storage/RackStorageController.js";
import { authenticateJWT } from "../../middleware/jwt.js";
import { validateBody } from "../../middleware/validate.js";
import { RackStorageDto, RackStorageUpdateDto } from "../../dto/storage/RackStorage.dto.js";

const router = express.Router();

router.post("/", authenticateJWT, validateBody(RackStorageDto), RackStorageController.createRack);
router.get("/", authenticateJWT, RackStorageController.getAllRacks);
router.get("/:id", authenticateJWT, RackStorageController.getRackById);
router.put("/:id", authenticateJWT, validateBody(RackStorageUpdateDto), RackStorageController.updateRack);
router.delete("/:id", authenticateJWT, RackStorageController.deleteRack);

export default router;

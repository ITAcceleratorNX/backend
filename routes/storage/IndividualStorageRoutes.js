import express from "express";
import * as individualStorageController from "../../controllers/storage/IndividualStorageController.js";
import {validateBody} from "../../middleware/validate.js";
import {IndividualStorageDto, UpdateIndividualStorageDto} from "../../dto/storage/IndividualStorage.dto.js";
import authenticateJWT from '../../middleware/jwt.js';

const router = express.Router();

router.get("/", authenticateJWT, individualStorageController.getAllIndividualStorages);
router.get("/:id", authenticateJWT, individualStorageController.getIndividualStorageById);
router.post("/", authenticateJWT, validateBody(IndividualStorageDto), individualStorageController.createIndividualStorage);
router.delete("/:id", authenticateJWT, individualStorageController.deleteIndividualStorage);
router.put("/:id", authenticateJWT, validateBody(UpdateIndividualStorageDto), individualStorageController.updateIndividualStorage);

export default router;
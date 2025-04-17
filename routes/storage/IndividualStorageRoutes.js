import express from "express";
import * as individualStorageController from "../../controllers/storage/IndividualStorageController.js";
import {validateBody} from "../../middleware/validate.js";
import {IndividualStorageDto, UpdateIndividualStorageDto} from "../../dto/storage/IndividualStorage.dto.js";

const router = express.Router();

router.get("/", individualStorageController.getAllIndividualStorages);
router.get("/:id", individualStorageController.getIndividualStorageById);
router.post("/", validateBody(IndividualStorageDto), individualStorageController.createIndividualStorage);
router.delete("/:id", individualStorageController.deleteIndividualStorage);
router.put("/:id", validateBody(UpdateIndividualStorageDto), individualStorageController.updateIndividualStorage);

export default router;
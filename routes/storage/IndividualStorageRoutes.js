import express from "express";
import * as individualStorageController from "../../controllers/storage/IndividualStorageController.js";

const router = express.Router();

router.get("", individualStorageController.getAllIndividualStorages);
router.get(":id", individualStorageController.getIndividualStorageById);
router.post("", individualStorageController.createIndividualStorage);
router.delete(":id", individualStorageController.deleteIndividualStorage);
router.put(":id", individualStorageController.updateIndividualStorage);

export default router;
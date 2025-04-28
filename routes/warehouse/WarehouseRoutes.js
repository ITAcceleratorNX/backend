import express from 'express';
import { WarehouseController } from '../../controllers/warehouse/WarehouseController.js';
import {validateBody} from "../../middleware/validate.js";
import {WarehouseDto, WarehouseUpdateDto} from "../../dto/warehouse/Warehause.dto.js";
import {authenticateJWT, authorizeAdmin} from "../../middleware/jwt.js";

const router = express.Router();

router.post('/', authorizeAdmin, validateBody(WarehouseDto), WarehouseController.create);
router.get('/', WarehouseController.getAll);
router.get('/:id', WarehouseController.getById);
router.put('/:id',authorizeAdmin,validateBody(WarehouseUpdateDto), WarehouseController.update);

export default router;

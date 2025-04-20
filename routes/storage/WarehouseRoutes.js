import express from 'express';
import { WarehouseController } from '../../controllers/storage/WarehouseController.js';
import {validateBody} from "../../middleware/validate.js";
import {WarehouseDto, WarehouseUpdateDto} from "../../dto/storage/Warehause.dto.js";

const router = express.Router();

router.post('/',validateBody(WarehouseDto) ,WarehouseController.create);
router.get('/', WarehouseController.getAll);
router.get('/:id', WarehouseController.getById);
router.put('/:id',validateBody(WarehouseUpdateDto) , WarehouseController.update);

export default router;

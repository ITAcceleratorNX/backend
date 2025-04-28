import express from 'express';
import {
    createContract, getAllContracts, getContractById, updateContract, deleteContract
} from '../../controllers/storage/ContractController.js';
import { validateBody } from '../../middleware/validate.js';
import { ContractDto, ContractUpdateDto } from '../../dto/storage/Contract.dto.js';

const router = express.Router();

router.post('/', validateBody(ContractDto), createContract);
router.get('/', getAllContracts);
router.get('/:id', getContractById);
router.put('/:id', validateBody(ContractUpdateDto), updateContract);
router.delete('/:id', deleteContract);

export default router;

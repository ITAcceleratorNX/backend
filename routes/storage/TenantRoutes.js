import express from 'express';
import {
    createTenant, getAllTenants, getTenantById, updateTenant, deleteTenant
} from '../../controllers/storage/TenantController.js';
import { validateBody } from '../../middleware/validate.js';
import { TenantDto, TenantUpdateDto } from '../../dto/storage/Tenant.dto.js';

const router = express.Router();

router.post('/', validateBody(TenantDto), createTenant);
router.get('/', getAllTenants);
router.get('/:id', getTenantById);
router.put('/:id', validateBody(TenantUpdateDto), updateTenant);
router.delete('/:id', deleteTenant);

export default router;

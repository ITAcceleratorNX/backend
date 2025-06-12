import express from 'express';
import { NotificationController } from '../../controllers/notification/notification.controller.js';


const router = express.Router();
const controller = new NotificationController();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id/read', controller.markRead);
router.delete('/:id', controller.delete);

export default router;


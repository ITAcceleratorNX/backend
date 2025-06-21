import express from 'express';
import { NotificationController } from '../../controllers/notification/notification.controller.js';


const router = express.Router();
const controller = new NotificationController();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/user', controller.getById);
router.patch('/:id/read', controller.markRead);
router.delete('/delete', controller.delete);
router.post('/bulk', controller.sendBulk);

export default router;


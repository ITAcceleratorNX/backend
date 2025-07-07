import express from 'express';
import OrderServiceController from '../../controllers/order_service/orderService.controller.js';

const router = express.Router();

// Все записи
router.get('/', OrderServiceController.getAll);

// Одна запись по ID
router.get('/:id', OrderServiceController.getById);

// Создание
router.post('/', OrderServiceController.create);

// Обновление по ID
router.put('/:id', OrderServiceController.update);

// Удаление по ID
router.delete('/:id', OrderServiceController.remove);

export default router;

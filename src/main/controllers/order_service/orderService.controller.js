import {OrderService} from '../../models/init/index.js';

const OrderServiceController = {
    async getAll(req, res) {
        try {
            const services = await OrderService.findAll();
            res.json(services);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка при получении услуг заказа' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const service = await OrderService.findByPk(id);
            if (!service) return res.status(404).json({ message: 'Услуга не найдена' });
            res.json(service);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка при получении услуги' });
        }
    },

    async create(req, res) {
        try {
            const { order_id, service_id } = req.body;
            const newRecord = await OrderService.create({ order_id, service_id });
            res.status(201).json(newRecord);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка при создании записи' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { order_id, service_id } = req.body;

            const record = await OrderService.findByPk(id);
            if (!record) return res.status(404).json({ message: 'Запись не найдена' });

            await record.update({ order_id, service_id });
            res.json(record);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка при обновлении записи' });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const record = await OrderService.findByPk(id);
            if (!record) return res.status(404).json({ message: 'Запись не найдена' });

            await record.destroy();
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка при удалении записи' });
        }
    }
};

export default OrderServiceController;

import { WarehouseService } from '../../service/warehouse/WarehouseService.js';

export class WarehouseController {
    static async create(req, res) {
        try {
            const warehouse = await WarehouseService.createWarehouse(req.body);
            res.status(201).json(warehouse);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const warehouses = await WarehouseService.getAllWarehouses();
            res.status(200).json(warehouses);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const warehouse = await WarehouseService.getWarehouseById(req.params.id);
            if (!warehouse) {
                res.status(404).json({ message: 'Warehouse not found' });
                return;
            }
            res.status(200).json(warehouse);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const warehouse = await WarehouseService.updateWarehouse(req.params.id, req.body);
            res.status(200).json(warehouse);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const warehouse = await WarehouseService.deleteWarehouseById(req.params.id);
            res.status(200).json(warehouse);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

import { WarehouseService } from '../../service/warehouse/WarehouseService.js';
import { asyncHandler } from '../../utils/handler/asyncHandler.js';

export class WarehouseController {
    static create = asyncHandler(async (req, res) => {
        const warehouse = await WarehouseService.createWarehouse(req.body);
        res.status(201).json(warehouse);
    });

    static getAll = asyncHandler(async (req, res) => {
        const warehouses = await WarehouseService.getAllWarehouses();
        res.status(200).json(warehouses);
    });

    static getById = asyncHandler(async (req, res) => {
        const warehouse = await WarehouseService.getWarehouseById(req.params.id);
        if (!warehouse) {
            res.status(404).json({ message: 'Warehouse not found' });
            return;
        }
        res.status(200).json(warehouse);
    });

    static update = asyncHandler(async (req, res) => {
        const warehouse = await WarehouseService.updateWarehouse(req.params.id, req.body);
        res.status(200).json(warehouse);
    });

    static delete = asyncHandler(async (req, res) => {
        const warehouse = await WarehouseService.deleteWarehouseById(req.params.id);
        res.status(200).json(warehouse);
    });
}

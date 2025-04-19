import { Warehouse} from '../../models/Warehouse.js';


export class WarehouseService {
    static async createWarehouse(data) {
        const warehouse = await Warehouse.create(data);
        return warehouse;
    }

    static async getWarehouseById(warehouseId) {
        return await Warehouse.findByPk(warehouseId);
    }

    static async updateWarehouse(warehouseId, data) {
        const warehouse = await Warehouse.findByPk(warehouseId);
        if (!warehouse) {
            throw new Error('Warehouse not found');
        }
        await warehouse.update(data);
        return warehouse;
    }

    static async getAllWarehouses() {
        return await Warehouse.findAll();
    }
}

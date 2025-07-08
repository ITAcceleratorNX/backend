import { Warehouse} from '../../models/init/index.js';


export class WarehouseService {
    static async create(data) {
        const warehouse = await Warehouse.create(data);
        return warehouse;
    }

    static async getById(warehouseId) {
        return await Warehouse.findByPk(warehouseId, {
            include: [
                {
                    association: 'storage'
                }
            ]
        });
    }

    static async update(warehouseId, data) {
        const warehouse = await Warehouse.findByPk(warehouseId);
        if (!warehouse) {
            throw new Error('Warehouse not found');
        }
        await warehouse.update(data);
        return warehouse;
    }

    static formatTime = (timeStr) => timeStr.substring(0, 5);

    static async getAll() {
        const warehouses = await Warehouse.findAll({
            include: [{ association: 'storage' }]
        });

        return warehouses.map(w => ({
            ...w.toJSON(),
            work_start: this.formatTime(w.work_start),
            work_end: this.formatTime(w.work_end),
        }));
    }

    static async deleteById(warehouseId) {
        const warehouse = await Warehouse.findByPk(warehouseId);
        if (!warehouse) {
            throw new Error('Warehouse not found');
        }
        await warehouse.destroy();
    }
}

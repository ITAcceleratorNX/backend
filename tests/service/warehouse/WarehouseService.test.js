import { WarehouseService } from '../../../service/warehouse/WarehouseService.js';
import { Warehouse } from '../../../models/init/index.js';

jest.mock('../../../models/init/index.js');

describe('WarehouseService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createWarehouse should create a new warehouse', async () => {
        const data = { name: 'Warehouse 1', location: 'Location 1' };
        const mockWarehouse = { id: 1, ...data };
        Warehouse.create.mockResolvedValue(mockWarehouse);
        const result = await WarehouseService.createWarehouse(data);
        expect(Warehouse.create).toHaveBeenCalledWith(data);
        expect(result).toEqual(mockWarehouse);
    });

    test('getWarehouseById should return a warehouse by id', async () => {
        const warehouseId = 1;
        const mockWarehouse = { id: warehouseId, name: 'Warehouse 1', location: 'Location 1' };
        Warehouse.findByPk.mockResolvedValue(mockWarehouse);
        const result = await WarehouseService.getWarehouseById(warehouseId);
        expect(Warehouse.findByPk).toHaveBeenCalledWith(warehouseId);
        expect(result).toEqual(mockWarehouse);
    });

    test('updateWarehouse should update and return the updated warehouse', async () => {
        const warehouseId = 1;
        const data = { name: 'Updated Warehouse', location: 'New Location' };
        const mockWarehouse = {
            id: warehouseId,
            ...data,
            update: jest.fn().mockResolvedValue(data)
        };
        Warehouse.findByPk.mockResolvedValue(mockWarehouse);
        const result = await WarehouseService.updateWarehouse(warehouseId, data);
        expect(Warehouse.findByPk).toHaveBeenCalledWith(warehouseId);
        expect(mockWarehouse.update).toHaveBeenCalledWith(data);
        expect(result).toEqual(expect.objectContaining({ id: warehouseId, ...data }));
    });

    test('updateWarehouse should throw an error if warehouse not found', async () => {
        const warehouseId = 999;
        const data = { name: 'Updated Warehouse', location: 'New Location' };
        Warehouse.findByPk.mockResolvedValue(null);
        await expect(WarehouseService.updateWarehouse(warehouseId, data)).rejects.toThrow('Warehouse not found'); // Проверяем, что выбрасывается ошибка
    });

    test('getAllWarehouses should return all warehouses', async () => {
        const mockWarehouses = [
            { id: 1, name: 'Warehouse 1', location: 'Location 1' },
            { id: 2, name: 'Warehouse 2', location: 'Location 2' }
        ];
        Warehouse.findAll.mockResolvedValue(mockWarehouses);
        const result = await WarehouseService.getAllWarehouses();
        expect(Warehouse.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockWarehouses);
    });
});

import * as RackStorageService from '../../../service/storage/RackStorageService.js';
import RackStorage from '../../../models/RackStorage.js';

jest.mock('../../../models/RackStorage.js');

describe('RackStorageService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createRack should create a rack', async () => {
        const data = { name: 'Rack A', capacity: 100, price: 5000 };
        RackStorage.create.mockResolvedValue(data);

        const result = await RackStorageService.createRack(data);

        expect(RackStorage.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Rack A',
            capacity: 100,
            occupied_volume: 0,
            price: expect.any(Number),
            custom_id: expect.stringMatching(/^RACK-\d{3}$/)
        }));
        expect(result).toEqual(expect.objectContaining({ name: 'Rack A' }));
    });

    test('getAllRacks should return all racks', async () => {
        const racks = [{ rack_id: 1 }, { rack_id: 2 }];
        RackStorage.findAll.mockResolvedValue(racks);

        const result = await RackStorageService.getAllRacks();
        expect(result).toEqual(racks);
    });

    test('getRackById should return rack by id', async () => {
        const rack = { rack_id: 1 };
        RackStorage.findByPk.mockResolvedValue(rack);

        const result = await RackStorageService.getRackById(1);
        expect(result).toEqual(rack);
    });

    test('updateRack should update rack by id', async () => {
        RackStorage.update.mockResolvedValue([1]);

        const result = await RackStorageService.updateRack(1, { name: 'Updated Rack' });
        expect(result).toEqual([1]);
    });

    test('deleteRack should delete rack by id', async () => {
        RackStorage.destroy.mockResolvedValue(1);

        const result = await RackStorageService.deleteRack(1);
        expect(result).toBe(1);
    });
});

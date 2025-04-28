import * as CloudStorageService from '../../../service/storage/CloudStorageService.js';
import CloudStorage from '../../../models/CloudStorage.js';

jest.mock('../../../models/CloudStorage.js');

describe('CloudStorageService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createCloud should create a new cloud storage', async () => {
        const data = {
            name: 'Cloud Room A',
            description: 'High volume storage',
            image_url: 'https://example.com/image.jpg',
            length: 5,
            width: 4,
            height: 3
        };
        CloudStorage.create.mockResolvedValue(data);

        const result = await CloudStorageService.createCloud(data);

        expect(CloudStorage.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Cloud Room A',
            description: 'High volume storage',
            image_url: 'https://example.com/image.jpg',
            length: 5,
            width: 4,
            height: 3,
            total_volume: expect.any(Number),
            price: expect.any(Number),
            custom_id: expect.stringMatching(/^CLOUD-ES-\d{3}$/)
        }));
        expect(result).toEqual(expect.objectContaining({ name: 'Cloud Room A' }));
    });

    test('getAllCloud should return all clouds', async () => {
        const clouds = [{ storage_id: 1 }, { storage_id: 2 }];
        CloudStorage.findAll.mockResolvedValue(clouds);

        const result = await CloudStorageService.getAllCloud();
        expect(result).toEqual(clouds);
    });

    test('getCloudById should return cloud by id', async () => {
        const cloud = { storage_id: 1 };
        CloudStorage.findByPk.mockResolvedValue(cloud);

        const result = await CloudStorageService.getCloudById(1);
        expect(result).toEqual(cloud);
    });

    test('updateCloud should update cloud by id', async () => {
        CloudStorage.update.mockResolvedValue([1]); // mock массив қайтарады
        const result = await CloudStorageService.updateCloud(1, { name: 'Updated Cloud' });
        expect(result).toBe(1); // нақты тек 1 күтеміз
    });

    test('deleteCloud should delete cloud by id', async () => {
        CloudStorage.destroy.mockResolvedValue(1);

        const result = await CloudStorageService.deleteCloud(1);
        expect(result).toBe(1);
    });
});

import * as IndividualStorageService from '../../../service/storage/IndividualStorageService.js';
import IndividualStorage from '../../../models/IndividualStorage.js';

jest.mock('../../../models/IndividualStorage.js');

describe('IndividualStorageService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createIndividualStorage should create a new storage', async () => {
        const data = { name: 'Room A', description: 'Big room', length: 5, width: 4 };
        IndividualStorage.create.mockResolvedValue(data);

        const result = await IndividualStorageService.createIndividualStorage(data);

        expect(IndividualStorage.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Room A',
            description: 'Big room',
            length: 5,
            width: 4,
            total_area: expect.any(Number),
            price: expect.any(Number),
            custom_id: expect.stringMatching(/^IND-MT-\d{3}$/)
        }));
        expect(result).toEqual(expect.objectContaining({ name: 'Room A' }));
    });

    test('getAllIndividualStorage should return all individual storages', async () => {
        const storages = [{ id: 1 }, { id: 2 }];
        IndividualStorage.findAll.mockResolvedValue(storages);

        const result = await IndividualStorageService.getAllIndividualStorage();
        expect(result).toEqual(storages);
    });

    test('getIndividualStorageById should return storage by id', async () => {
        const storage = { id: 1 };
        IndividualStorage.findByPk.mockResolvedValue(storage);

        const result = await IndividualStorageService.getIndividualStorageById(1);
        expect(result).toEqual(storage);
    });

    test('updateIndividualStorage should update storage by id', async () => {
        IndividualStorage.update.mockResolvedValue([1]);

        const result = await IndividualStorageService.updateIndividualStorage(1, { name: 'Updated' });
        expect(result).toEqual([1]);
    });

    test('deleteIndividualStorage should delete storage by id', async () => {
        IndividualStorage.destroy.mockResolvedValue(1);

        const result = await IndividualStorageService.deleteIndividualStorage(1);
        expect(result).toBe(1);
    });
});

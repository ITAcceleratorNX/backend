import {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} from '../../../service/storage/CloudItemService.js';

import CloudItem from '../../../models/CloudItem.js';

jest.mock('../../../models/CloudItem.js');

describe('cloudItemService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllItems должен вернуть список элементов', async () => {
        const mockItems = [{ item_id: 1 }, { item_id: 2 }];
        CloudItem.findAll.mockResolvedValue(mockItems);

        const result = await getAllItems();
        expect(result).toEqual(mockItems);
        expect(CloudItem.findAll).toHaveBeenCalledTimes(1);
    });

    test('getItemById должен вернуть элемент по id', async () => {
        const mockItem = { item_id: 1 };
        CloudItem.findByPk.mockResolvedValue(mockItem);

        const result = await getItemById(1);
        expect(result).toEqual(mockItem);
        expect(CloudItem.findByPk).toHaveBeenCalledWith(1);
    });

    test('createItem должен создать новый элемент', async () => {
        const inputData = { description: 'Test', volume: 10.0 };
        const createdItem = { item_id: 3, ...inputData };
        CloudItem.create.mockResolvedValue(createdItem);

        const result = await createItem(inputData);
        expect(result).toEqual(createdItem);
        expect(CloudItem.create).toHaveBeenCalledWith(inputData);
    });

    test('updateItem должен обновить элемент по id', async () => {
        CloudItem.update.mockResolvedValue([1]);

        const result = await updateItem(1, { description: 'Updated' });
        expect(result).toBe(1);
        expect(CloudItem.update).toHaveBeenCalledWith({ description: 'Updated' }, { where: { item_id: 1 } });
    });

    test('deleteItem должен удалить элемент по id', async () => {
        CloudItem.destroy.mockResolvedValue(1);

        const result = await deleteItem(1);
        expect(result).toBe(1);
        expect(CloudItem.destroy).toHaveBeenCalledWith({ where: { item_id: 1 } });
    });
});

import * as RackItemService from '../../../service/storage/RackItemService.js';
import RackItem from '../../../models/RackItem.js';

jest.mock('../../../models/RackItem.js');

describe('RackItemService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createItem should create a rack item', async () => {
        const data = { rack_id: 1, description: 'Box', volume: 5.5 };
        RackItem.create.mockResolvedValue(data);

        const result = await RackItemService.createItem(data);

        expect(RackItem.create).toHaveBeenCalledWith(data);
        expect(result).toEqual(data);
    });

    test('getAllItems should return all rack items', async () => {
        const items = [{ item_id: 1 }, { item_id: 2 }];
        RackItem.findAll.mockResolvedValue(items);

        const result = await RackItemService.getAllItems();
        expect(result).toEqual(items);
    });

    test('getItemById should return a rack item by id', async () => {
        const item = { item_id: 1 };
        RackItem.findByPk.mockResolvedValue(item);

        const result = await RackItemService.getItemById(1);
        expect(result).toEqual(item);
    });

    test('updateItem should update a rack item by id', async () => {
        RackItem.update.mockResolvedValue([1]);

        const result = await RackItemService.updateItem(1, { description: 'Updated Box' });

        expect(result).toBe(1);
    });

    test('deleteItem should delete a rack item by id', async () => {
        RackItem.destroy.mockResolvedValue(1);

        const result = await RackItemService.deleteItem(1);
        expect(result).toBe(1);
    });
});

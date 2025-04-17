// 📁 tests/service/storage/CloudStorageOrderService.test.js
import CloudStorageOrder from "../../../models/CloudStorageOrder.js";
import * as CloudStorageOrderService from "../../../service/storage/СloudStorageOrderService.js";
import CloudStorage from "../../../models/CloudStorage.js";
import Price from "../../../models/Price.js";

jest.mock('../../../models/CloudStorageOrder.js', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    }
}));

jest.mock('../../../models/CloudStorage.js', () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn()
    }
}));

jest.mock('../../../models/Price.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn()
    }
}));

describe('CloudStorageOrder Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        test('should create and return new cloud storage order', async () => {
            const input = {
                user_id: 1,
                storage_id: 1,
                length: 2,
                width: 2,
                height: 2,
                rental_start: new Date("2024-07-01"),
                rental_end: new Date("2024-08-01")
            };

            CloudStorage.findByPk.mockResolvedValue({ type_id: 1 });
            Price.findOne.mockResolvedValue({ amount: '5000' });

            const expectedOrder = {
                storage_order_id: 1,
                ...input,
                volume: 8,
                total_amount: 5000 * 31
            };

            CloudStorageOrder.create.mockResolvedValue(expectedOrder);

            const data = await CloudStorageOrderService.createOrder(input);

            expect(CloudStorageOrder.create).toHaveBeenCalled();
            expect(data).toEqual(expect.objectContaining({ storage_order_id: 1 }));
        });
    });

    describe('getAllOrders', () => {
        test('should return all cloud storage orders', async () => {
            const mockOrders = [
                { storage_order_id: 1, storage_id: 2 },
                { storage_order_id: 2, storage_id: 3 }
            ];
            CloudStorageOrder.findAll.mockResolvedValue(mockOrders);

            const result = await CloudStorageOrderService.getAllOrders();

            expect(CloudStorageOrder.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockOrders);
        });
    });

    describe('getOrderById', () => {
        test('should return cloud storage order by ID', async () => {
            const mockOrder = { storage_order_id: 1, storage_id: 2 };
            CloudStorageOrder.findByPk.mockResolvedValue(mockOrder);

            const result = await CloudStorageOrderService.getOrderById(1);

            expect(CloudStorageOrder.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockOrder);
        });
    });

    describe('updateOrder', () => {
        test('should update and return affected rows count', async () => {
            CloudStorageOrder.update.mockResolvedValue([1]);

            const result = await CloudStorageOrderService.updateOrder(1, { length: 3 });

            expect(CloudStorageOrder.update).toHaveBeenCalledWith(
                { length: 3 },
                { where: { storage_order_id: 1 } }
            );
            expect(result).toEqual({ updated: 1 });
        });
    });

    describe('deleteOrder', () => {
        test('should delete and return deleted count', async () => {
            CloudStorageOrder.findByPk.mockResolvedValue({ storage_order_id: 1 });
            CloudStorageOrder.destroy.mockResolvedValue(1);

            const result = await CloudStorageOrderService.deleteOrder(1);

            expect(CloudStorageOrder.findByPk).toHaveBeenCalledWith(1);
            expect(CloudStorageOrder.destroy).toHaveBeenCalledWith({ where: { storage_order_id: 1 } });
            expect(result).toEqual({ deleted: 1 });
        });

        test('should throw error if order not found', async () => {
            CloudStorageOrder.findByPk.mockResolvedValue(null);

            await expect(CloudStorageOrderService.deleteOrder(999))
                .rejects
                .toThrow('Order not found');
        });
    });
});

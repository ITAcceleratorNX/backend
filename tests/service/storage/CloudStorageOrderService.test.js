import CloudStorageOrder from "../../../models/CloudStorageOrder.js";
import * as CloudStorageOrderService from "../../../service/storage/СloudStorageOrderService.js";

jest.mock('../../../models/CloudStorageOrder.js', () => ({
    __esModule: true, // <- обязательно, если используешь ES-модули
    default: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    }
}));


const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('CloudStorageOrder Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        test('should create and return new cloud storage order', async () => {
            const input = {
                user_id: 1,
                storage_id: 2,
                length: 2,
                width: 2,
                height: 2,
                rental_start: new Date(),
                rental_end: new Date()
            };
            const result = { order_id: 1, ...input };

            CloudStorageOrder.create.mockResolvedValue(result);

            const data = await CloudStorageOrderService.createOrder(input);

            expect(CloudStorageOrder.create).toHaveBeenCalledWith(input);
            expect(data).toEqual(result); // ✅
        });
    });


    describe('getAllOrders', () => {
        test('should return all cloud storage orders', async () => {
            const mockOrders = [
                { order_id: 1, storage_id: 2 },
                { order_id: 2, storage_id: 3 }
            ];
            CloudStorageOrder.findAll.mockResolvedValue(mockOrders);

            const result = await CloudStorageOrderService.getAllOrders();

            expect(CloudStorageOrder.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockOrders); // ✅
        });
    });


    describe('getOrderById', () => {
        test('should return cloud storage order by ID', async () => {
            const mockOrder = { order_id: 1, storage_id: 2 };
            CloudStorageOrder.findByPk.mockResolvedValue(mockOrder);

            const result = await CloudStorageOrderService.getOrderById(1);

            expect(CloudStorageOrder.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockOrder); // ✅ Проверяем return, а не res.json
        });
    });


    describe('updateOrder', () => {
        test('should update and return affected rows count', async () => {
            // Мокируем, что заказ с id = 1 найден
            const mockOrder = { order_id: 1, storage_id: 2, length: 2, width: 2, height: 2 };
            CloudStorageOrder.findByPk.mockResolvedValue(mockOrder);

            // Мокируем обновление, которое возвращает количество обновленных строк
            CloudStorageOrder.update.mockResolvedValue([1]);

            const req = { params: { id: 1 }, body: { length: 3, width: 3, height: 3 } };
            const res = mockRes();

            // Вызов обновления
            await CloudStorageOrderService.updateOrder(req.params.id, req.body, res); // передаем res

            // Проверяем, что метод update был вызван с правильными параметрами
            expect(CloudStorageOrder.update).toHaveBeenCalledWith(req.body, { where: { order_id: req.params.id } });

            // Проверяем, что результат был отправлен в response
            expect(res.json).toHaveBeenCalledWith({ updated: 1 });
        });
    });



    describe('deleteOrder', () => {
        test('should delete and return deleted count', async () => {
            CloudStorageOrder.findByPk = jest.fn().mockResolvedValue({ order_id: 1 });
            CloudStorageOrder.destroy = jest.fn().mockResolvedValue(1);

            const deleted = await CloudStorageOrderService.deleteOrder(1);

            expect(CloudStorageOrder.findByPk).toHaveBeenCalledWith(1);
            expect(CloudStorageOrder.destroy).toHaveBeenCalledWith({ where: { order_id: 1 } });
            expect(deleted).toBe(1);
        });

        test('should throw error if order not found', async () => {
            CloudStorageOrder.findByPk = jest.fn().mockResolvedValue(null);

            await expect(CloudStorageOrderService.deleteOrder(999))
                .rejects
                .toThrow('Order not found');
        });
    });



    describe('deleteOrder should throw error if not found', () => {
        test('should throw error if order not found', async () => {
            CloudStorageOrder.findByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            await expect(CloudStorageOrderService.deleteOrder(req.params.id))
                .rejects
                .toThrow('Order not found');
        });
    });
});

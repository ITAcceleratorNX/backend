import CloudStorage from "../../models/CloudStorage.js";
import CloudStorageController from "../../controllers/CloudStorageController.js"; // Дұрыс импорт

jest.mock('../../models/CloudStorage.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
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

describe('CloudStorage', () => {
    describe('getAllCloud', () => {
        test('should return all cloud storage records', async () => {
            const mockData = [{ unit_id: 1, name: 'Cloud A' }];
            CloudStorage.findAll.mockResolvedValue(mockData);

            const res = mockRes();
            await CloudStorageController.getAllCloud({}, res);

            expect(res.json).toHaveBeenCalledWith(mockData); // `json` функциясы дұрыс жұмыс істеп тұр ма тексеру
        });
    });

    describe('createCloud', () => {
        test('should create and return new cloud storage', async () => {
            const input = { name: 'Cloud B' };
            const result = { unit_id: 2, ...input };
            CloudStorage.create.mockResolvedValue(result);

            const req = { body: input };
            const res = mockRes();
            await CloudStorageController.createCloud(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(result); // `json` дұрыс қайтарылып жатқаны тексеру
        });
    });

    describe('updateCloud', () => {
        test('should update and return affected rows count', async () => {
            CloudStorage.update.mockResolvedValue([1]); // Бір жазба жаңарғанын көрсету

            const req = { params: { id: 1 }, body: { name: 'Updated Cloud' } };
            const res = mockRes();
            await CloudStorageController.updateCloud(req, res);

            expect(res.json).toHaveBeenCalledWith({ updated: 1 }); // Қайтарылған мәнді тексеру
        });
    });

    describe('deleteCloud', () => {
        test('should delete and return deleted count', async () => {
            CloudStorage.destroy.mockResolvedValue(1); // Бір жазба жойылғанын көрсету

            const req = { params: { id: 1 } };
            const res = mockRes();
            await CloudStorageController.deleteCloud(req, res);

            expect(res.json).toHaveBeenCalledWith({ deleted: 1 }); // Жойылған жазбаны тексеру
        });
    });
});

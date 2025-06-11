import * as service from "../../../main/service/price/PriceService.js";
import {Service} from "../../../main/models/init/index.js";

jest.mock("../../../main/models/init/index.js");

describe("Price Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getAll should return all prices", async () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        Service.findAll.mockResolvedValue(mockData);

        const result = await service.getAll();

        expect(Service.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockData);
    });

    test("getById should return one serivce", async () => {
        const mockData = { id: 1 };
        Service.findByPk.mockResolvedValue(mockData);

        const result = await service.getById(1);

        expect(Service.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockData);
    });

    it('should create a new serivce if type does not exist', async () => {
        const mockData = { type: 'rack', amount: 100 };

        Service.findOne.mockResolvedValue(null);
        Service.create.mockResolvedValue({ id: 1, ...mockData });

        const result = await service.create(mockData);

        expect(Service.findOne).toHaveBeenCalledWith({ where: { type: 'rack' } });
        expect(Service.create).toHaveBeenCalledWith(mockData);
        expect(result).toEqual({ id: 1, ...mockData });
    });

    test("update should call update with correct params", async () => {
        const id = 5;
        const updateData = { name: "Updated" };
        Service.update.mockResolvedValue([1]);

        const result = await service.update(id, updateData);

        expect(Service.update).toHaveBeenCalledWith(updateData, {
            where: { id: id },
        });
        expect(result).toEqual([1]);
    });

    test("deleteById should delete by id", async () => {
        Service.destroy.mockResolvedValue(1);

        const result = await service.deleteById(3);

        expect(Service.destroy).toHaveBeenCalledWith({
            where: { id: 3 },
        });
        expect(result).toBe(1);
    });

    test("calculate should return error if serivce not found", async () => {
        Service.findOne.mockResolvedValue(null);

        const mockData = {
            type: "UNKNOWN_TYPE",
            area: 2,
            month: 1
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const result = await service.calculate(mockData, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid date" });
        expect(result).toBeUndefined();
    });

    test("calculate should return error if data is invalid", async () => {
        const mockData = {
            type: 123, // wrong type
            area: "invalid", // wrong type
            month: null
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const result = await service.calculate(mockData, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid date" });
        expect(result).toBeUndefined();
    });

    test("calculate should return correct total serivce", async () => {
        const mockPrice = { amount: 100 };
        Service.findOne.mockResolvedValue(mockPrice);

        const mockData = {
            type: "INDIVIDUAL",
            area: 2,
            month: 1
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const result = await service.calculate(mockData, mockRes);

        const expectedTotal = 100 * 2 * 1;

        expect(result).toBe(expectedTotal);
        expect(Service.findOne).toHaveBeenCalledWith({ where: { type: "INDIVIDUAL" } });
    });
});
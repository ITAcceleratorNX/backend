import * as service from "../../../main/service/price/PriceService.js";
import {Price} from "../../../main/models/init/index.js";

jest.mock("../../../main/models/init/index.js");

describe("Price Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getAll should return all prices", async () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        Price.findAll.mockResolvedValue(mockData);

        const result = await service.getAll();

        expect(Price.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockData);
    });

    test("getById should return one price", async () => {
        const mockData = { id: 1 };
        Price.findByPk.mockResolvedValue(mockData);

        const result = await service.getById(1);

        expect(Price.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockData);
    });

    it('should create a new price if type does not exist', async () => {
        const mockData = { type: 'rack', amount: 100 };

        Price.findOne.mockResolvedValue(null);
        Price.create.mockResolvedValue({ id: 1, ...mockData });

        const result = await service.create(mockData);

        expect(Price.findOne).toHaveBeenCalledWith({ where: { type: 'rack' } });
        expect(Price.create).toHaveBeenCalledWith(mockData);
        expect(result).toEqual({ id: 1, ...mockData });
    });

    test("update should call update with correct params", async () => {
        const id = 5;
        const updateData = { name: "Updated" };
        Price.update.mockResolvedValue([1]);

        const result = await service.update(id, updateData);

        expect(Price.update).toHaveBeenCalledWith(updateData, {
            where: { id: id },
        });
        expect(result).toEqual([1]);
    });

    test("deleteById should delete by id", async () => {
        Price.destroy.mockResolvedValue(1);

        const result = await service.deleteById(3);

        expect(Price.destroy).toHaveBeenCalledWith({
            where: { id: 3 },
        });
        expect(result).toBe(1);
    });

    test("calculate should return error if price not found", async () => {
        Price.findOne.mockResolvedValue(null);

        const mockData = {
            type: "UNKNOWN_TYPE",
            area: 2,
            month: 1,
            day: 0
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
            month: null,
            day: null
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

    test("calculate should return correct total price", async () => {
        const mockPrice = { amount: 100 };
        Price.findOne.mockResolvedValue(mockPrice);

        const mockData = {
            type: "INDIVIDUAL",
            area: 2,
            month: 1,
            day: 15
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const result = await service.calculate(mockData, mockRes);

        const expectedMonthly = 100 * 2 * 1; // 200
        const expectedDaily = (100 * 2 / 30) * 15; // 100
        const expectedTotal = expectedMonthly + expectedDaily; // 300

        expect(result).toBe(expectedTotal);
        expect(Price.findOne).toHaveBeenCalledWith({ where: { type: "INDIVIDUAL" } });
    });
});
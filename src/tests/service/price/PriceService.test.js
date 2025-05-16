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

    test("should create a price", async () => {
        const input = { amount: 1234, type: "INDIVIDUAL_STORAGE" };
        const created = { id: 1, ...input };
        Price.create.mockResolvedValue(created);

        const result = await service.create(input);

        expect(Price.create).toHaveBeenCalledWith(input);
        expect(result).toEqual(created);
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
});

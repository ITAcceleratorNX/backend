import * as service from "../../../service/faq/FAQService.js";
import {FAQ} from "../../../models/init/index.js";

jest.mock("../../../models/init/index.js");

describe("FAQService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getAll should return all FAQ", async () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        FAQ.findAll.mockResolvedValue(mockData);

        const result = await service.getAll();

        expect(FAQ.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockData);
    });

    test("getById should return one FAQ", async () => {
        const mockData = { id: 1 };
        FAQ.findByPk.mockResolvedValue(mockData);

        const result = await service.getById(1);

        expect(FAQ.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockData);
    });

    test("should create a FAQ", async () => {
        const input = { name: "FAQ A" };
        const created = { id: 1, ...input };
        FAQ.create.mockResolvedValue(created);

        const result = await service.create(input);

        expect(FAQ.create).toHaveBeenCalledWith(input);
        expect(result).toEqual(created);
    });

    test("update should call update with correct params", async () => {
        const id = 5;
        const updateData = { name: "Updated" };
        FAQ.update.mockResolvedValue([1]);

        const result = await service.update(id, updateData);

        expect(FAQ.update).toHaveBeenCalledWith(updateData, {
            where: { id: id },
        });
        expect(result).toEqual([1]);
    });

    test("deleteById should delete by id", async () => {
        FAQ.destroy.mockResolvedValue(1);

        const result = await service.deleteById(3);

        expect(FAQ.destroy).toHaveBeenCalledWith({
            where: { id: 3 },
        });
        expect(result).toBe(1);
    });
});

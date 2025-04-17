import * as service from "../../../service/storage/IndividualStorageService.js";
import IndividualStorage from "../../../models/IndividualStorage.js";

jest.mock("../../../models/IndividualStorage.js");

describe("IndividualStorageService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getAll should return all individual storages", async () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        IndividualStorage.findAll.mockResolvedValue(mockData);

        const result = await service.getAll();

        expect(IndividualStorage.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockData);
    });

    test("getById should return one storage", async () => {
        const mockData = { id: 1 };
        IndividualStorage.findByPk.mockResolvedValue(mockData);

        const result = await service.getById(1);

        expect(IndividualStorage.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockData);
    });

    test("should create a storage", async () => {
        const input = { name: "Storage A" };
        const created = { id: 1, ...input };
        IndividualStorage.create.mockResolvedValue(created);

        const result = await service.create(input);

        expect(IndividualStorage.create).toHaveBeenCalledWith(input);
        expect(result).toEqual(created);
    });

    test("update should call update with correct params", async () => {
        const id = 5;
        const updateData = { name: "Updated" };
        IndividualStorage.update.mockResolvedValue([1]);

        const result = await service.update(id, updateData);

        expect(IndividualStorage.update).toHaveBeenCalledWith(updateData, {
            where: { unit_id: id },
        });
        expect(result).toEqual([1]);
    });

    test("deleteById should delete by unit_id", async () => {
        IndividualStorage.destroy.mockResolvedValue(1);

        const result = await service.deleteById(3);

        expect(IndividualStorage.destroy).toHaveBeenCalledWith({
            where: { unit_id: 3 },
        });
        expect(result).toBe(1);
    });
});

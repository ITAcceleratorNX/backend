import * as service from "../../../main/service/storage/StorageService.js";
import {Storage} from "../../../main/models/init/index.js";

jest.mock("../../../main/models/init/index.js");

describe("StorageService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getAll should return all individual storages", async () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        Storage.findAll.mockResolvedValue(mockData);

        const result = await service.getAll();

        expect(Storage.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockData);
    });

    test("getById should return one storage", async () => {
        const mockData = { id: 1 };
        Storage.findByPk.mockResolvedValue(mockData);

        const result = await service.getById(1);

        expect(Storage.findByPk).toHaveBeenCalledWith(1, {});
        expect(result).toEqual(mockData);
    });

    test("should create a storage", async () => {
        const input = { name: "Storage A" };
        const created = { id: 1, ...input };
        Storage.create.mockResolvedValue(created);

        const result = await service.create(input);

        expect(Storage.create).toHaveBeenCalledWith(input, undefined);
        expect(result).toEqual(created);
    });

    test("update should call update with correct params", async () => {
        const id = 5;
        const updateData = { name: "Updated" };
        Storage.update.mockResolvedValue([1]);

        const result = await service.update(id, updateData);

        expect(Storage.update).toHaveBeenCalledWith(updateData, {
            where: { id: id },
        });
        expect(result).toEqual([1]);
    });

    test("deleteById should delete by unit_id", async () => {
        Storage.destroy.mockResolvedValue(1);

        const result = await service.deleteById(3);

        expect(Storage.destroy).toHaveBeenCalledWith({
            where: { id: 3 },
        });
        expect(result).toBe(1);
    });
});

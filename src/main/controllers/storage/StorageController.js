import * as storageService from "../../service/storage/StorageService.js";
import {StorageCells} from "../../models/init/index.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";
import {createBaseController} from "../base/BaseController.js";

const base = createBaseController(storageService, {
    getById: {
        include: {
            model: StorageCells,
            as: 'cells'
        }
    }
});

export const getAllStorages = base.getAll;
export const getStorageById = base.getById;

export const createStorage = asyncHandler(async (req, res) => {
    await storageService.createStorage(req);
    res.status(201).json({ message: 'Storage created successfully' });
});

export const updateStorage = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const [updatedCount] = await storageService.update(id, req.body);
    res.json({ updated: updatedCount });
});

export const deleteStorage = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const deletedCount = await storageService.deleteById(id);
    res.json({ deleted: deletedCount });
});

import * as storageService from "../../service/storage/StorageService.js";
import * as storageCellsService from "../../service/storage/StorageCellsService.js";
import {sequelize} from "../../config/database.js";
import {StorageCells} from "../../models/init/index.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

export const getAllStorages = asyncHandler(async (req, res) => {
    const result = await storageService.getAll();
    res.json(result);
});

export const getStorageById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const result = await storageService.getById(id, {
        include: {
            model: StorageCells,
            as: 'cells'
        }
    });
    if (!result) return res.status(404).json({ error: 'Not found' });

    res.json(result);
});

export const createStorage = asyncHandler(async (req, res) => {
    await sequelize.transaction(async (t) => {
        const storage = await storageService.create(req.body, { transaction: t });

        const cells = [];
        for (let x = 1; x <= req.body.columns; x++) {
            for (let y = 1; y <= req.body.rows; y++) {
                cells.push({
                    storage_id: storage.id,
                    x,
                    y
                });
            }
        }

        await storageCellsService.createCells(cells, { transaction: t });
        res.status(201).json({ message: 'Storage created successfully' });
    });
});

export const updateStorage = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const [updatedCount] = await storageService.update(id, req.body);
    if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ updated: updatedCount });
});

export const deleteStorage = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const deletedCount = await storageService.deleteById(id);
    if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ deleted: deletedCount });
});

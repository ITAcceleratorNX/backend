import * as storageService from "../../service/storage/StorageService.js";
import {StorageCells} from "../../models/init/index.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";
import {createBaseController} from "../base/BaseController.js";
import logger from "../../utils/winston/logger.js";

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
    logger.info('Created new storage', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        requestId: req.id,
        data: req.body
    });
    res.status(201).json({ message: 'Storage created successfully' });
});

export const updateStorage = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        logger.warn('Invalid ID received for update', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
            idParam: req.params.id
        });
        return res.status(400).json({ error: 'Invalid ID' });
    }

    const [updatedCount] = await storageService.update(id, req.body);
    logger.info('Updated storage', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        requestId: req.id,
        resourceId: id,
        updates: req.body
    });
    res.json({ updated: updatedCount });
});

export const deleteStorage = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        logger.warn('Invalid ID received for deletion', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
            idParam: req.params.id
        });
        return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedCount = await storageService.deleteById(id);
    logger.info('Deleted storage', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        requestId: req.id,
        resourceId: id
    });
    res.json({ deleted: deletedCount });
});

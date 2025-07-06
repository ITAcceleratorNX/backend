import { asyncHandler } from "../../utils/handler/asyncHandler.js";
import logger from "../../utils/winston/logger.js";

export function createBaseController(service, options = {}) {
    return {
        getAll: asyncHandler(async (req, res) => {
            const result = await service.getAll();
            logger.info('Fetched all resources', {
                userId: req.user?.id || null,
                endpoint: req.originalUrl,
                requestId: req.id
            });
            res.json(result);
        }),

        getById: asyncHandler(async (req, res) => {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                logger.warn('Invalid ID received', {
                    userId: req.user?.id || null,
                    endpoint: req.originalUrl,
                    requestId: req.id,
                    idParam: req.params.id
                });
                return res.status(400).json({ error: 'Invalid ID', details: [{message: "Invalid ID"}] });
            }

            const result = await service.getById(id, options.getById || {});
            if (!result) {
                logger.info('Resource not found', {
                    userId: req.user?.id || null,
                    endpoint: req.originalUrl,
                    requestId: req.id,
                    resourceId: id
                });
                return res.status(404).json({ error: 'Not found' });
            }

            logger.info('Fetched resource', {
                userId: req.user?.id || null,
                endpoint: req.originalUrl,
                requestId: req.id,
                resourceId: id
            });
            res.json(result);
        }),

        create: asyncHandler(async (req, res) => {
            const result = await service.create(req.body);
            logger.info('Created new resource', {
                userId: req.user?.id || null,
                endpoint: req.originalUrl,
                requestId: req.id,
                data: req.body
            });
            res.status(201).json(result);
        }),

        update: asyncHandler(async (req, res) => {
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

            const updated = await service.update(id, req.body);
            if (!updated) {
                logger.info('Resource to update not found', {
                    userId: req.user?.id || null,
                    endpoint: req.originalUrl,
                    requestId: req.id,
                    resourceId: id
                });
                return res.status(404).json({ error: 'Not found' });
            }

            logger.info('Updated resource', {
                userId: req.user?.id || null,
                endpoint: req.originalUrl,
                requestId: req.id,
                resourceId: id,
                updates: req.body
            });
            res.json({ updated });
        }),

        delete: asyncHandler(async (req, res) => {
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

            const deletedCount = await service.deleteById(id);
            if (deletedCount === 0) {
                logger.info('Resource to delete not found', {
                    userId: req.user?.id || null,
                    endpoint: req.originalUrl,
                    requestId: req.id,
                    resourceId: id
                });
                return res.status(404).json({ error: 'Not found' });
            }

            logger.info('Deleted resource', {
                userId: req.user?.id || null,
                endpoint: req.originalUrl,
                requestId: req.id,
                resourceId: id
            });
            res.json({ deleted: deletedCount });
        }),
    };
}
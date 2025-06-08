import { asyncHandler } from "../../utils/handler/asyncHandler.js";

export function createBaseController(service, options = {}) {
    return {
        getAll: asyncHandler(async (req, res) => {
            const result = await service.getAll();
            res.json(result);
        }),

        getById: asyncHandler(async (req, res) => {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

            const result = await service.getById(id, options.getById || {});
            if (!result) return res.status(404).json({ error: 'Not found' });

            res.json(result);
        }),

        create: asyncHandler(async (req, res) => {
            const result = await service.create(req.body);
            res.status(201).json(result);
        }),

        update: asyncHandler(async (req, res) => {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

            const [updatedCount] = await service.update(id, req.body);
            if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

            res.json({ updated: updatedCount });
        }),

        delete: asyncHandler(async (req, res) => {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

            const deletedCount = await service.deleteById(id);
            if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

            res.json({ deleted: deletedCount });
        }),
    };
}
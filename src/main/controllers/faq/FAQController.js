import * as FAQService from "../../service/faq/FAQService.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

export const getAllFAQ = asyncHandler(async (req, res) => {
    const result = await FAQService.getAll();
    res.json(result);
});

export const getFAQById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const result = await FAQService.getById(id);
    if (!result) return res.status(404).json({ error: 'Not found' });

    res.json(result);
});

export const createFAQ = asyncHandler(async (req, res) => {
    const result = await FAQService.create(req.body);
    res.status(201).json(result);
});

export const updateFAQ = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const [updatedCount] = await FAQService.update(id, req.body);
    if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ updated: updatedCount });
});

export const deleteFAQ = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const deletedCount = await FAQService.deleteById(id);
    if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ deleted: deletedCount });
});

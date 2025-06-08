import * as priceService from "../../service/price/PriceService.js";
import {PriceType} from "../../dto/price/Pirce.dto.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

export const getAllPrices = asyncHandler(async (req, res) => {
    const result = await priceService.getAll();
    res.json(result);
});

export const getPriceByType = asyncHandler(async (req, res) => {
    const type = req.params.type;
    if (!PriceType.safeParse(type).success) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    const result = await priceService.getByType(req.params.type);
    if (!result) return res.status(404).json({ error: 'Not found' });

    res.json(result);
});

export const createPrice = asyncHandler(async (req, res) => {
    const priceTypeExists = await priceService.getByType(req.body.type);
    if (priceTypeExists) return res.status(400).json({ error: 'Price already exists for this type' });

    const result = await priceService.create(req.body);
    res.status(201).json(result);
});

export const updatePrice = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const [updatedCount] = await priceService.update(id, req.body);
    if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ updated: updatedCount });
});

export const deletePrice = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const deletedCount = await priceService.deleteById(id);
    if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ deleted: deletedCount });
});

export const calculatePrice = asyncHandler(async (req, res) => {
    await priceService.calculate(req.body, res);
});

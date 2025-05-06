import * as priceService from "../../service/price/PriceService.js";

export const getAllPrices = async (req, res) => {
    try {
        const result = await priceService.getAll();
        return res.json(result);
    } catch (err) {
        console.error('Get all prices error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPriceById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const result = await priceService.getById(id);
        if (!result) return res.status(404).json({ error: 'Not found' });

        return res.json(result);
    } catch (err) {
        console.error('Get price by ID error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createPrice = async (req, res) => {
    try {
        const priceTypeExists = await priceService.getByType(req.body.type);
        if (priceTypeExists) return res.status(400).json({ error: 'Price already exists for this type' });
        const result = await priceService.create(req.body);
        return res.status(201).json(result);
    } catch (err) {
        console.error('Create price error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updatePrice = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const [updatedCount] = await priceService.update(id, req.body);
        if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ updated: updatedCount });
    } catch (err) {
        console.error('Update price error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deletePrice = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const deletedCount = await priceService.deleteById(id);
        if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ deleted: deletedCount });
    } catch (err) {
        console.error('Delete price error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const calculatePrice = async (req, res) => {
    return await priceService.calculate(req.body, res);
}

import * as FAQService from "../../service/faq/FAQService.js";

export const getAllFAQ = async (req, res) => {
    try {
        const result = await FAQService.getAll();
        return res.json(result);
    } catch (err) {
        console.error('Get FAQ error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getFAQById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const result = await FAQService.getById(id);
        if (!result) return res.status(404).json({ error: 'Not found' });

        return res.json(result);
    } catch (err) {
        console.error('Get FAQ by ID error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createFAQ = async (req, res) => {
    try {
        const result = await FAQService.create(req.body);
        return res.status(201).json(result);
    } catch (err) {
        console.error('Create FAQ error:', err, "request body", req.body);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateFAQ = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const [updatedCount] = await FAQService.update(id, req.body);
        if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ updated: updatedCount });
    } catch (err) {
        console.error('Update FAQ error:', err, "request body:", req.body);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteFAQ = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const deletedCount = await FAQService.deleteById(id);
        if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ deleted: deletedCount });
    } catch (err) {
        console.error('Delete FAQ error:', err, "request body:", req.body);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

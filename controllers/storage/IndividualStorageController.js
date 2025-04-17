import * as individualStorageService from "../../service/storage/IndividualStorageService.js";

export const getAllIndividualStorages = async (req, res) => {
    try {
        const result = await individualStorageService.getAll();
        return res.json(result);
    } catch (err) {
        console.error('Get all IND storages error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getIndividualStorageById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const result = await individualStorageService.getById(id);
        if (!result) return res.status(404).json({ error: 'Not found' });

        return res.json(result);
    } catch (err) {
        console.error('Get IND storage by ID error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createIndividualStorage = async (req, res) => {
    try {
        const result = await individualStorageService.create(req.body);
        return res.status(201).json(result);
    } catch (err) {
        console.error('Create IND storage error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateIndividualStorage = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const [updatedCount] = await individualStorageService.update(id, req.body);
        if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ updated: updatedCount });
    } catch (err) {
        console.error('Update IND storage error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteIndividualStorage = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const deletedCount = await individualStorageService.deleteById(id);
        if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ deleted: deletedCount });
    } catch (err) {
        console.error('Delete IND error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

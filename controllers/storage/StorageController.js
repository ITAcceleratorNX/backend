import * as storageService from "../../service/storage/StorageService.js";

export const getAllStorages = async (req, res) => {
    try {
        const result = await storageService.getAll();
        return res.json(result);
    } catch (err) {
        console.error('Get all storages error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getStorageById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const result = await storageService.getById(id);
        if (!result) return res.status(404).json({ error: 'Not found' });

        return res.json(result);
    } catch (err) {
        console.error('Get storage by ID error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createStorage = async (req, res) => {
    try {
        const file = req.file;
        const imageUrl = file?.path || null;

        // Пішіннен сандарды шығарып алу және тексеру
        const length = parseFloat(req.body.length);
        const width = parseFloat(req.body.width);
        const height = parseFloat(req.body.height);

        if (isNaN(length) || isNaN(width) || isNaN(height)) {
            return res.status(400).json({ error: 'Length, width, and height must be numbers' });
        }

        const total_volume = +(length * width * height).toFixed(2);

        const storage = await storageService.create({
            ...req.body,
            length,
            width,
            height,
            total_volume,
            available_volume: total_volume,
            image_url: imageUrl,
        });

        res.status(201).json(storage);
    } catch (error) {
        console.error("❌ Error in createStorage:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const updateStorage = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const [updatedCount] = await storageService.update(id, req.body);
        if (updatedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ updated: updatedCount });
    } catch (err) {
        console.error('Update storage error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteStorage = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const deletedCount = await storageService.deleteById(id);
        if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

        return res.json({ deleted: deletedCount });
    } catch (err) {
        console.error('Delete storage error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


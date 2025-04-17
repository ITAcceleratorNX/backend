import * as CloudStorageService from "../../service/storage/CloudStorageService.js";

const getAllCloud = async (req, res) => {
    try {
        const clouds = await CloudStorageService.getAllCloud();
        return res.json(clouds);
    } catch (err) {
        console.error('Error occurred:', err);
        return res.status(500).json({ error: err.message });
    }
};

const getCloudById = async (req, res) => {
    try {
        const cloud = await CloudStorageService.getCloudById(req.params.id);
        if (!cloud) {
            return res.status(404).json({ error: 'Cloud storage not found' });
        }
        return res.json(cloud); // Мәліметті қайтару
    } catch (err) {
        console.error('Error occurred:', err);
        return res.status(500).json({ error: err.message });
    }
};

const createCloud = async (req, res) => {
    try {
        const cloud = await CloudStorageService.createCloud(req.body);
        return res.status(201).json(cloud);
    } catch (err) {
        console.error('Error occurred:', err);
        return res.status(500).json({ error: err.message });
    }
};

const updateCloud = async (req, res) => {
    try {
        const updatedCloud = await CloudStorageService.updateCloud(req.params.id, req.body);
        if (updatedCloud[0] === 0) {
            return res.status(404).json({ error: 'Cloud storage not found' });
        }
        return res.json({ updated: updatedCloud[0] });
    } catch (err) {
        console.error('Error occurred:', err);
        return res.status(500).json({ error: err.message });
    }
};

const deleteCloud = async (req, res) => {
    try {
        const deletedCount = await CloudStorageService.deleteCloud(req.params.id);
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Cloud storage not found' });
        }
        return res.json({ deleted: deletedCount });
    } catch (err) {
        console.error('Error occurred:', err);
        return res.status(500).json({ error: err.message });
    }
};

export default {
    getAllCloud,
    getCloudById,
    createCloud,
    updateCloud,
    deleteCloud,
};

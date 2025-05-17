import * as storageService from "../../service/storage/StorageService.js";
import * as storageCellsService from "../../service/storage/StorageCellsService.js";
import {sequelize} from "../../config/database.js";
import {StorageCells} from "../../models/init/index.js";

export const getAllStorages = async (req, res) => {
    try {
        const result = await storageService.getAll();
        return res.json(result);
    } catch (err) {
        console.error('Get all IND storages error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getStorageById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const result = await storageService.getById(id, {
            include: {
            model: StorageCells,
                as: 'cells'
        }});
        if (!result) return res.status(404).json({ error: 'Not found' });

        return res.json(result);
    } catch (err) {
        console.error('Get IND storage by ID error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createStorage = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const file = req.file;
        const imageUrl = file?.path || null;

        const { name, warehouse_id, storage_type, description, status, rows, columns, height } = req.body;

        const parsedRows = parseInt(rows);
        const parsedCols = parseInt(columns);
        const parsedHeight = parseFloat(height);

        if (isNaN(parsedRows) || isNaN(parsedCols) || isNaN(parsedHeight)) {
            return res.status(400).json({ error: 'Rows, columns, and height must be valid numbers' });
        }

        const total_volume = +(parsedRows * parsedCols * parsedHeight).toFixed(2);

        const storage = await storageService.create({
            name,
            warehouse_id,
            storage_type,
            description,
            status,
            image_url: imageUrl,
            height: parsedHeight,
            total_volume,
        }, { transaction: t });

        const cells = [];
        for (let x = 1; x <= parsedCols; x++) {
            for (let y = 1; y <= parsedRows; y++) {
                cells.push({
                    storage_id: storage.id,
                    x,
                    y
                });
            }
        }

        await storageCellsService.createCells(cells, { transaction: t });
        await t.commit();

        res.status(201).json({ message: 'Storage with cells created successfully', storage_id: storage.id });
    } catch (err) {
        await t.rollback();
        console.error('Create IND storage error:', err);
        return res.status(500).json({ error: 'Internal server error' });
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
        console.error('Update IND storage error:', err);
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
        console.error('Delete IND error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

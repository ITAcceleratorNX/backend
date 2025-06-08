import {Storage} from "../../models/init/index.js";
import {sequelize} from "../../config/database.js";
import * as storageCellsService from "./StorageCellsService.js";

export const getAll = async () => {
    return Storage.findAll();
};

export const getById = async (id, options = {}) => {
    return Storage.findByPk(id, options);
};

export const create = async (data, options) => {
    return Storage.create(data, options);
};

export const update = async (id, data) => {
    const updatedCount = await Storage.update(data, { where: { id: id } });
    if (updatedCount === 0) {
        const error = new Error('Not Found');
        error.status = 404;
        throw error;
    }
    return updatedCount;
};

export const deleteById = async (id) => {
    const deletedCount = await Storage.destroy({ where: { id: id } });
    if (deletedCount === 0) {
        const error = new Error('Not Found');
        error.status = 404;
        throw error;
    }
    return deletedCount;
};

export const createStorage = async (req) => {
    await sequelize.transaction(async (t) => {
        const storage = await create(req.body, { transaction: t });

        const cells = [];
        for (let x = 1; x <= req.body.columns; x++) {
            for (let y = 1; y <= req.body.rows; y++) {
                cells.push({
                    storage_id: storage.id,
                    x,
                    y
                });
            }
        }

        await storageCellsService.createCells(cells, { transaction: t });
        return true;
    });
}

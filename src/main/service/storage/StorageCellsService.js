import {StorageCells} from "../../models/init/index.js";

export const createCells = async (data, options) => {
    return StorageCells.bulkCreate(data, options);
};

export const update = async (id, data, options) => {
    return StorageCells.update(data, { where: { id: id } }, options);
};

export const updateStorageCells = async (ids, data, options) => {
    return StorageCells.update(data, {
        where: {
            id: ids,
        },
        ...options,
    });
}

export const findAll = async (options) => {
    return StorageCells.findAll(options);
}
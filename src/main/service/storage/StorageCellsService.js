import {StorageCells} from "../../models/init/index.js";

export const createCells = async (data, options) => {
    return StorageCells.bulkCreate(data, options);
};

export const update = async (id, data) => {
    return StorageCells.update(data, { where: { id: id } });
};

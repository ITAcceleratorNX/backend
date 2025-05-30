import {Storage} from "../../models/init/index.js";

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
    return Storage.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return Storage.destroy({ where: { id: id } });
};

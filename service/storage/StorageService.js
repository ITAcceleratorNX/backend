import {Storage} from "../../models/init/index.js";

export const getAll = async () => {
    return Storage.findAll();
};

export const getById = async (id) => {
    return Storage.findByPk(id);
};

export const create = async (data) => {
    return Storage.create(data);
};

export const update = async (id, data) => {
    return Storage.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return Storage.destroy({ where: { id: id } });
};

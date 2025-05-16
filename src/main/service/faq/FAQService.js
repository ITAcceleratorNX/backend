import {FAQ} from "../../models/init/index.js";

export const getAll = async () => {
    return FAQ.findAll();
};

export const getById = async (id) => {
    return FAQ.findByPk(id);
};

export const create = async (data) => {
    return FAQ.create(data);
};

export const update = async (id, data) => {
    return FAQ.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return FAQ.destroy({ where: { id: id } });
};

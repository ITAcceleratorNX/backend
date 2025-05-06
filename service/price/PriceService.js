import {Price} from "../../models/init/index.js";

export const getAll = async () => {
    return Price.findAll();
};

export const getById = async (id) => {
    return Price.findByPk(id);
};

export const create = async (data) => {
    return Price.create(data);
};

export const update = async (id, data) => {
    return Price.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return Price.destroy({ where: { id: id } });
};

export const getByType = async (type) => {
    return Price.findOne({ where: { type: type } });
}

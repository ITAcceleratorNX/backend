import User from "../../models/User.js";

export const create = async (data) => {
    return await User.create(data);
};

export const getAll = async () => {
    return await User.findAll();
};

export const getById = async (id) => {
    return await User.findByPk(id);
};

export const update = async (id, data) => {
    return await User.update(data, { where: { user_id: id } });
};

export const deleteById = async (id) => {
    return await User.destroy({ where: { user_id: id } });
};

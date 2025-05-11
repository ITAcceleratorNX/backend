// service/UserService.js
import User from "../../models/User.js";

export const createUser = async (data) => {
    return await User.create(data);
};

export const getAllUsers = async () => {
    return await User.findAll();
};

export const getUserById = async (id) => {
    return await User.findByPk(id);
};

export const updateUser = async (id, data) => {
    return await User.update(data, { where: { id: id } });
};

export const deleteUser = async (id) => {
    return await User.destroy({ where: { user_id: id } });
};

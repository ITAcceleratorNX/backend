import User from "../../models/User.js";

export const create = async (data) => {
    return await User.create(data);
};

export const getAll = async () => {
    return await User.findAll();
};

export const getById = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return user;
};

export const update = async (id, data) => {
    const updated = await User.update(data, { where: { id: id } });
    if (!updated) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return updated;
};

export const deleteById = async (id) => {
    const deleted = await User.destroy({ where: { user_id: id } });
    if (!deleted) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return deleted;
};

export const getManagers = async () => {
    return await User.findAll({where: { role: 'MANAGER' }});
}

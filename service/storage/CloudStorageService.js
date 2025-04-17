import CloudStorage from "../../models/CloudStorage.js";

const getAllCloud = async () => {
    try {
        return await CloudStorage.findAll();
    } catch (error) {
        console.error("Ошибка при получении всех облачных хранилищ:", error);
        throw error;
    }
};

const getCloudById = async (id) => {
    try {
        return await CloudStorage.findByPk(id);
    } catch (error) {
        console.error(`Ошибка при получении облачного хранилища с id ${id}:`, error);
        throw error;
    }
};

const createCloud = async (data) => {
    try {
        return await CloudStorage.create(data);
    } catch (error) {
        console.error("Ошибка при создании облачного хранилища:", error);
        throw error;
    }
};

const updateCloud = async (id, data) => {
    try {
        const [updatedRows] = await CloudStorage.update(data, { where: { storage_id: id } });
        return updatedRows;
    } catch (error) {
        console.error(`Ошибка при обновлении облачного хранилища с id ${id}:`, error);
        throw error;
    }
};

const deleteCloud = async (id) => {
    try {
        return await CloudStorage.destroy({ where: { storage_id: id } });
    } catch (error) {
        console.error(`Ошибка при удалении облачного хранилища с id ${id}:`, error);
        throw error;
    }
};

export {
    getAllCloud,
    getCloudById,
    createCloud,
    updateCloud,
    deleteCloud,
};

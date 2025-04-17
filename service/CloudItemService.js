import CloudItem from '../models/CloudItem.js';

const getAllItems = async () => {
    try {
        return await CloudItem.findAll();
    } catch (error) {
        console.error("Ошибка при получении всех элементов:", error);
        throw error;
    }
};

const getItemById = async (id) => {
    try {
        return await CloudItem.findByPk(id);
    } catch (error) {
        console.error(`Ошибка при получении элемента с id ${id}:`, error);
        throw error;
    }
};

const createItem = async (data) => {
    try {
        return await CloudItem.create(data);
    } catch (error) {
        console.error("Ошибка при создании элемента:", error);
        throw error;
    }
};

const updateItem = async (id, data) => {
    try {
        const [updatedRows] = await CloudItem.update(data, { where: { item_id: id } });
        return updatedRows;
    } catch (error) {
        console.error(`Ошибка при обновлении элемента с id ${id}:`, error);
        throw error;
    }
};

const deleteItem = async (id) => {
    try {
        return await CloudItem.destroy({ where: { item_id: id } });
    } catch (error) {
        console.error(`Ошибка при удалении элемента с id ${id}:`, error);
        throw error;
    }
};

export {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};

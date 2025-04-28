import CloudStorage from "../../models/CloudStorage.js";

let cloudCounter = 1; // CLOUD-ES-001 бастап санау үшін

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
        const { name, description, image_url, length, width, height } = data;

        const total_volume = length * width * height;
        const price = total_volume * 1000;

        const custom_id = `CLOUD-ES-${String(cloudCounter).padStart(3, '0')}`;
        cloudCounter++;

        return await CloudStorage.create({
            name,
            description,
            image_url,
            length,
            width,
            height,
            total_volume,
            price,
            custom_id
        });
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

import CloudStorage from "../../models/CloudStorage.js";

let cloudCounter = 1;
function generateCloudCustomId() {
    return `CLOUD-ES-${String(cloudCounter++).padStart(3, '0')}`;
}

const getAllCloud = async () => {
    try {
        return await CloudStorage.findAll();
    } catch (err) {
        console.error("Error fetching all cloud storage:", err);
        throw err;
    }
};

const getCloudById = async (id) => {
    try {
        return await CloudStorage.findByPk(id);
    } catch (err) {
        console.error("Error fetching cloud storage by ID:", err);
        throw err;
    }
};

const createCloud = async (data) => {
    try {
        const newData = {
            ...data,
            custom_id: generateCloudCustomId()
        };
        return await CloudStorage.create(newData);
    } catch (err) {
        console.error("Error creating cloud storage:", err);
        throw err;
    }
};

const updateCloud = async (id, data) => {
    try {
        return await CloudStorage.update(data, { where: { storage_id: id } });
    } catch (err) {
        console.error("Error updating cloud storage:", err);
        throw err;
    }
};

const deleteCloud = async (id) => {
    try {
        return await CloudStorage.destroy({ where: { storage_id: id } });
    } catch (err) {
        console.error("Error deleting cloud storage:", err);
        throw err;
    }
};

export {
    getAllCloud,
    getCloudById,
    createCloud,
    updateCloud,
    deleteCloud,
};
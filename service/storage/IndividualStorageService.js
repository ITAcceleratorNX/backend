import IndividualStorage from "../../models/IndividualStorage.js";

let counter = 1;
function generateCustomId() {
    return `IND-MT-${String(counter++).padStart(3, '0')}`;
}

export const getAll = async () => {
    try {
        return await IndividualStorage.findAll();
    } catch (err) {
        console.error("Error fetching all individual storage:", err);
        throw err;
    }
};

export const getById = async (id) => {
    try {
        return await IndividualStorage.findByPk(id);
    } catch (err) {
        console.error("Error fetching individual storage by ID:", err);
        throw err;
    }
};

export const create = async (data) => {
    try {
        const newData = {
            ...data,
            custom_id: generateCustomId()
        };
        return await IndividualStorage.create(newData);
    } catch (err) {
        console.error("Error creating individual storage:", err);
        throw err;
    }
};

export const update = async (id, data) => {
    try {
        return await IndividualStorage.update(data, { where: { unit_id: id } });
    } catch (err) {
        console.error("Error updating individual storage:", err);
        throw err;
    }
};

export const deleteById = async (id) => {
    try {
        return await IndividualStorage.destroy({ where: { unit_id: id } });
    } catch (err) {
        console.error("Error deleting individual storage:", err);
        throw err;
    }
};
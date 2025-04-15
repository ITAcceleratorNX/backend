
import CloudStorage from "../models/CloudStorage.js";
const getAllCloud = () => CloudStorage.findAll();
const getCloudById = (id) => CloudStorage.findByPk(id);
const createCloud = (data) => CloudStorage.create(data);
const updateCloud = (id, data) => CloudStorage.update(data, { where: { unit_id: id } });
const deleteCloud = (id) => CloudStorage.destroy({ where: { unit_id: id } });
module.exports = {
    getAllCloud,
    getCloudById,
    createCloud,
    updateCloud,
    deleteCloud,
};
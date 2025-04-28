// service/storage/RackStorageService.js
import RackStorage from "../../models/RackStorage.js";

let rackCounter = 1; // Нөмірлеу басталады RACK-001

export const createRack = async (data) => {
    const { name, capacity } = data;
    const price = capacity * 500; // Мысал ставкасы
    const custom_id = `RACK-${String(rackCounter).padStart(3, "0")}`;
    rackCounter++;

    return await RackStorage.create({
        name,
        capacity,
        occupied_volume: 0,
        price,
        custom_id
    });
};

export const getAllRacks = async () => {
    return await RackStorage.findAll();
};

export const getRackById = async (id) => {
    return await RackStorage.findByPk(id);
};

export const updateRack = async (id, data) => {
    return await RackStorage.update(data, { where: { rack_id: id } });
};

export const deleteRack = async (id) => {
    return await RackStorage.destroy({ where: { rack_id: id } });
};

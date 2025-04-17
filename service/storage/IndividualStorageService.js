import IndividualStorage from "../../models/IndividualStorage.js";

export const getAll = async () => {
    return IndividualStorage.findAll();
};

export const getById = async (id) => {
    return IndividualStorage.findByPk(id);
};

export const create = async (data) => {
    return IndividualStorage.create(data);
};

export const update = async (id, data) => {
    return IndividualStorage.update(data, { where: { unit_id: id } });
};

export const deleteById = async (id) => {
    return IndividualStorage.destroy({ where: { unit_id: id } });
};

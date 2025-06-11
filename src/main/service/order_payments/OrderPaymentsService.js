import {OrderPayment} from "../../models/init/index.js";

export const create = async (data, options = {}) => {
    return OrderPayment.create(data, options);
};

export const bulkCreate = async (data, options = {}) => {
    return OrderPayment.bulkCreate(data, options);
};

export const update = async (id, data) => {
    return OrderPayment.update(data, { where: { id: id } });
};
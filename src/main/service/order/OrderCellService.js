import {OrderCells} from "../../models/init/index.js";

export const createOrderCells = async (data, options) => {
    return OrderCells.bulkCreate(data, options);
};
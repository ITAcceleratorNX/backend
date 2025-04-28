import RackItem from '../../models/RackItem.js';

export const createItem = (data) => RackItem.create(data);
export const getAllItems = () => RackItem.findAll();
export const getItemById = (id) => RackItem.findByPk(id);
export const updateItem = async (id, data) => {
    const [updatedRows] = await RackItem.update(data, { where: { item_id: id } });
    return updatedRows;
};
export const deleteItem = (id) => RackItem.destroy({ where: { item_id: id } });

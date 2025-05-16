import { Order, StorageCells } from "../../models/init/index.js";

export const getAll = async () => {
    return Order.findAll({
        include: [
            {
                model: StorageCells,
                include: [
                    {
                        association: 'storage'
                    }
                ],
                through: { attributes: [] },
            }
        ]
    });
};

export const getById = async (id) => {
    return Order.findByPk(id, {
        include: [
            {
                model: StorageCells,
                include: [
                    {
                        association: 'storage'
                    }
                ],
                through: { attributes: [] },
            }
        ]
    });
};

export const getByUserId = async (userId) => {
    return Order.findAll({
        where: { user_id: userId },
        include: [
            {
                model: StorageCells,
                include: [
                    {
                        association: 'storage'
                    }
                ],
                through: { attributes: [] },
            }
        ]
    });
};

export const create = async (data, options) => {
    return Order.create(data, options);
};

export const update = async (id, data) => {
    return Order.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return Order.destroy({ where: { id: id } });
};
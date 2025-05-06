import {Price} from "../../models/init/index.js";
import {CalculatePriceDto} from "../../dto/price/Pirce.dto.js";

export const calculate = async (data, res) => {
    try {
        const dto = CalculatePriceDto.parse(data);

        const price = await getByType(dto.type);

        if (!price) {
            console.error(`Price not found for type ${dto.type}`);
            res.status(400).json({error: `Price not found for type ${dto.type}`});
            return
        }

        const amount = price.amount;
        const { area, month, day } = dto;

        const monthlyCost = amount * area * month;
        const dailyCost = (amount * area / 30) * day;
        return res.status(200).json({ price: monthlyCost + dailyCost })
    } catch (error) {
        console.error('Calculate price error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export const getAll = async () => {
    return Price.findAll();
};

export const getById = async (id) => {
    return Price.findByPk(id);
};

export const create = async (data) => {
    return Price.create(data);
};

export const update = async (id, data) => {
    return Price.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return Price.destroy({ where: { id: id } });
};

export const getByType = async (type) => {
    return Price.findOne({ where: { type: type } });
}

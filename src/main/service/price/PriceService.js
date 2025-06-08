import {Price} from "../../models/init/index.js";
import {CalculatePriceDto} from "../../dto/price/Pirce.dto.js";

export const calculate = async (data, res) => {
    let dto;
    try {
        dto = CalculatePriceDto.parse(data);
    } catch (error) {
        console.error('Calculate price error:', error);
        res.status(400).json({ error: "Invalid date" });
        return;
    }
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
        return  monthlyCost + dailyCost;
}


export const getAll = async () => {
    return Price.findAll();
};

export const getById = async (id) => {
    return Price.findByPk(id);
};

export const create = async (data) => {
    const priceTypeExists = await Price.findOne({ where: { type: data.type } });
    if (priceTypeExists) {
        const error = new Error('Price already exists for this type');
        error.status = 400;
        throw error;
    }
    return Price.create(data);
};

export const update = async (id, data) => {
    return Price.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return Price.destroy({ where: { id: id } });
};

export const getByType = async (type) => {
    const price = await Price.findOne({ where: { type: type } });
    if (!price) {
        const error = new Error('Not Found');
        error.status = 404;
        throw error;
    }
    return price;
}

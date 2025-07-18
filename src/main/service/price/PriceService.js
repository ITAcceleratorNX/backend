import {Service} from "../../models/init/index.js";
import {CalculatePriceDto} from "../../dto/serivce/Service.dto.js";

export const calculate = async (data, res) => {
    let dto;
    try {
        dto = CalculatePriceDto.parse(data);
    } catch (error) {
        console.error('Calculate price error:', error);
        res.status(400).json({ error: "Invalid date" });
        return;
    }
    const service = await getByType(dto.type);

    if (!service) {
        console.error(`Service not found for type ${dto.type}`);
        res.status(400).json({error: `Service not found for type ${dto.type}`});
        return
    }

    const price = service.price;
    const { area, month } = dto;
    console.log(price, area, month)
    return  price * area * month;
}


export const getAll = async () => {
    return Service.findAll();
};

export const getById = async (id) => {
    return Service.findByPk(id);
};

export const create = async (data) => {
    const priceTypeExists = await Service.findOne({ where: { type: data.type } });
    if (priceTypeExists) {
        const error = new Error('Service already exists for this type');
        error.status = 400;
        throw error;
    }
    return Service.create(data);
};

export const update = async (id, data) => {
    return Service.update(data, { where: { id: id } });
};

export const deleteById = async (id) => {
    return Service.destroy({ where: { id: id } });
};

export const getByType = async (type) => {
    const price = await Service.findOne({ where: { type: type } });
    if (!price) {
        const error = new Error('service type not found');
        error.status = 404;
        throw error;
    }
    return price;
}

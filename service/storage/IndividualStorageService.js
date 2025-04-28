// 📄 service/storage/IndividualStorageService.js
import  IndividualStorage  from '../../models/IndividualStorage.js';

let roomCounter = 1; // IND-MT-001 бастап санау үшін

export const getAllIndividualStorage = async () => {
    return await IndividualStorage.findAll();
};

export const getIndividualStorageById = async (id) => {
    return await IndividualStorage.findByPk(id);
};

export const createIndividualStorage = async (data) => {
    const { name, description, length, width } = data;

    // Площадь және Баға есептеу
    const total_area = length * width;
    const price = total_area * 1000;

    // ID генерация
    const custom_id = `IND-MT-${String(roomCounter).padStart(3, '0')}`;
    roomCounter++;

    return await IndividualStorage.create({
        name,
        description,
        length,
        width,
        total_area,
        price,
        custom_id
    });
};

export const updateIndividualStorage = async (id, data) => {
    return await IndividualStorage.update(data, { where: { id } });
};

export const deleteIndividualStorage = async (id) => {
    return await IndividualStorage.destroy({ where: { id } });
};


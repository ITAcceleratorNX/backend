import Delivery from '../../models/Delivery.js';

export const createDeliveryRequest = (data) => Delivery.create(data);

export const getAllDeliveries = () => Delivery.findAll();

export const getDeliveryById = (id) => Delivery.findByPk(id);

export const updateDeliveryStatus = (id, status) =>
    Delivery.update({ status }, { where: { delivery_id: id } });

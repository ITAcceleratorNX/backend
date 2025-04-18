import CloudStorageOrder from "../../models/CloudStorageOrder.js";
import Price from "../../models/Price.js";
import CloudStorage from "../../models/CloudStorage.js";

const calculateTariff = async (storage_type_id, volume, duration_days) => {
    const price = await Price.findOne({ where: { storage_type_id } });
    if (!price) throw new Error("Тариф табылмады");
    return parseFloat(price.amount) * duration_days;
};

export const createOrder = async (orderData) => {
    const { length, width, height, rental_start, rental_end } = orderData;
    const volume = length * width * height;
    const duration_days = Math.ceil(
        (new Date(rental_end).getTime() - new Date(rental_start).getTime()) / (1000 * 3600 * 24)
    );

    const cloudStorage = await CloudStorage.findByPk(orderData.storage_id);
    if (!cloudStorage) {
        throw new Error(`CloudStorage not found for ID: ${orderData.storage_id}`);
    }

    const total_amount = await calculateTariff(cloudStorage.type_id, volume, duration_days);

    return await CloudStorageOrder.create({
        ...orderData,
        volume,
        total_amount
    });
};

export const getAllOrders = () => CloudStorageOrder.findAll();

export const getOrderById = (id) => CloudStorageOrder.findByPk(id);

export const updateOrder = async (id, data) => {
    const updatedCount = await CloudStorageOrder.update(data, { where: { storage_order_id: id } });
    return { updated: updatedCount[0] };
};

export const deleteOrder = async (id) => {
    const existingOrder = await CloudStorageOrder.findByPk(id);
    if (!existingOrder) {
        throw new Error("Order not found");
    }
    const deletedCount = await CloudStorageOrder.destroy({ where: { storage_order_id: id } });
    return { deleted: deletedCount };
};

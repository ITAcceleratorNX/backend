import CloudStorageOrder from "../../models/CloudStorageOrder.js";
import Price from "../../models/Price.js";
import CloudStorage from "../../models/CloudStorage.js";

const calculateTariff = async (storage_type_id, volume, duration_days) => {
    try {
        const price = await Price.findOne({
            where: {
                storage_type_id
            }
        });

        if (!price) throw new Error("Тариф табылмады");
        return parseFloat(price.amount) * duration_days;
    } catch (err) {
        console.error("Error calculating tariff:", err);
        throw err;
    }
};

export const createOrder = async (orderData) => {
    try {
        const { length, width, height, rental_start, rental_end } = orderData;
        const volume = length * width * height;

        const duration_days = Math.ceil(
            (new Date(rental_end) - new Date(rental_start)) / (1000 * 3600 * 24)
        );

        // CloudStorage-тен type_id алу
        const cloudStorage = await CloudStorage.findByPk(orderData.storage_id);

        if (!cloudStorage) {
            console.error("CloudStorage not found for ID:", orderData.storage_id);
            throw new Error(`CloudStorage not found for ID: ${orderData.storage_id}`);
        }

        const total_amount = await calculateTariff(cloudStorage.type_id, volume, duration_days);

        const order = await CloudStorageOrder.create({
            ...orderData,
            volume,
            total_amount
        });

        return order;
    } catch (err) {
        console.error("Error creating cloud storage order:", err);
        throw err;
    }
};

export const getAllOrders = async () => {
    try {
        return await CloudStorageOrder.findAll();
    } catch (err) {
        console.error("Error fetching orders:", err);
        throw err;
    }
};

export const getOrderById = async (id) => {
    try {
        return await CloudStorageOrder.findByPk(id);
    } catch (err) {
        console.error("Error fetching order by ID:", err);
        throw err;
    }
};

export const updateOrder = async (id, data) => {
    try {
        const updatedCount = await CloudStorageOrder.update(data, { where: { storage_order_id: id } });
        return { updated: updatedCount[0] };
    } catch (err) {
        console.error("Error updating order:", err);
        throw err;
    }
};

export const deleteOrder = async (id) => {
    try {
        const order = await CloudStorageOrder.findByPk(id);
        if (!order) {
            throw new Error("Order not found");
        }
        const deletedCount = await CloudStorageOrder.destroy({
            where: { storage_order_id: id },
        });

        return { deleted: deletedCount };
    } catch (err) {
        throw err;
    }
};
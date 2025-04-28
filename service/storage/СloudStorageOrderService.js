
import CloudStorageOrder from "../../models/CloudStorageOrder.js";

export const createOrder = async (orderData) => {
    try {
        const order = await CloudStorageOrder.create(orderData);
        return order;
    } catch (error) {
        console.error('Ошибка при получении всех элементов:', error);
        throw new Error("Error creating order");
    }
};

export const getAllOrders = async () => {
    try {
        const orders = await CloudStorageOrder.findAll();
        return orders;
    } catch (error) {
        console.error('Ошибка при получении всех элементов:', error);
        throw new Error("Error fetching orders");
    }
};

export const getOrderById = async (id) => {
    try {
        const order = await CloudStorageOrder.findByPk(id);
        if (!order) {
            throw new Error("Order not found");
        }
        return order;
    } catch (error) {
        console.error('Ошибка при получении всех элементов:', error);
        throw new Error("Error fetching order");
    }
};

export const updateOrder = async (id, data) => {
    try {
        const order = await CloudStorageOrder.findByPk(id);

        if (!order) {
            throw new Error("Order not found");
        }

        const [updatedCount] = await CloudStorageOrder.update(data, { where: { order_id: id } });

        return updatedCount; // ✅ Тек сан қайтарады
    } catch (error) {
        console.error('Ошибка при обновлении заказа:', error);
        throw new Error("Error updating order");
    }
};





export const deleteOrder = async (id) => {
    try {
        const order = await CloudStorageOrder.findByPk(id);
        if (!order) {
            throw new Error("Order not found");
        }
        const deletedCount = await CloudStorageOrder.destroy({
            where: { order_id: id },
        });

        return deletedCount;
    } catch (error) {
        if (error.message === "Order not found") {
            throw error;
        }
        throw new Error("Error deleting order");
    }
};


export default {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};

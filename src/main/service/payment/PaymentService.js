import {Order} from "../../models/init/index.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

export const create = asyncHandler(async (data) => {
    const order = await Order.findOne(data.order_id);
    if (!order) {
        throw Object.assign(new Error('order not found'), { status: 200 });
    }
});

export const getByUserId = async (user_id) => {

}
import { z } from 'zod';
import {MovingOrderDto} from "../moving/MovingOrder.dto.js";
import {OrderServiceDto} from "../serivce/Service.dto.js";

export const ORDER_STATUSES = z.enum(["APPROVED"]);
export const OrderDto = z.object({
    storage_id: z.number({
        required_error: 'storage_id is required',
        invalid_type_error: 'storage_id must be a number',
    }),
    months: z.number().int().min(1),
    order_items: z.array(z.object({
        name: z.string().nonempty(),
        volume: z.number().gt(0),
        cargo_mark: z.enum(["NO", "HEAVY", "FRAGILE"])
    })).nonempty(),
    is_selected_moving: z.boolean().optional(),
    is_selected_package: z.boolean().optional(),
    punct33: z.string().optional(),
});

export const ApproveOrderDto = z.object({
    status: ORDER_STATUSES,
    is_selected_moving: z.boolean().optional(),
    is_selected_package: z.boolean().optional(),
    moving_orders: z.array(MovingOrderDto).optional(),
    services: z.array(OrderServiceDto).optional(),
})

export const OrderUpdateDto = OrderDto.partial();

export const ExtendedOrderDto = z.object({
    order_id: z.number({
        required_error: 'order_id is required',
        invalid_type_error: 'order_id must be a number',
    }),
    months: z.number().int().min(1),
});
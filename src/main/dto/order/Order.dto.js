import { z } from 'zod';
import {MovingOrderDto} from "../moving/MovingOrder.dto.js";
import {OrderServiceDto} from "../serivce/Service.dto.js";

export const Order = z.object({
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
    is_selected_moving: z.boolean(),
    is_selected_package: z.boolean(),
    moving_orders: z.array(MovingOrderDto).optional(),
    services: z.array(OrderServiceDto).optional(),
    punct33: z.string().optional(),
});

export const OrderDto = Order.superRefine((data, ctx) => {
    if (data.is_selected_moving && (!data.moving_orders || data.moving_orders.length === 0)) {
        ctx.addIssue({
            path: ['moving_orders'],
            code: z.ZodIssueCode.custom,
            message: 'moving_orders is required',
        });
    }

    if (data.is_selected_package && (!data.services || data.services.length === 0)) {
        ctx.addIssue({
            path: ['services'],
            code: z.ZodIssueCode.custom,
            message: 'services is required',
        });
    }
})

export const OrderUpdateDto = Order.partial();

export const ExtendedOrderDto = z.object({
    is_extended: z.boolean(),
    order_id: z.number({
        required_error: 'order_id is required',
        invalid_type_error: 'order_id must be a number',
    }).optional(),
    months: z.number().int().min(1).optional(),
});
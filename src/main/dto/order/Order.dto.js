import { z } from 'zod';

export const ORDER_STATUSES = z.enum(["INACTIVE", "APPROVED", "ACTIVE"]);
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
    })).nonempty()
});

export const OrderStatusDto = z.object({
    status: ORDER_STATUSES
})

export const OrderUpdateDto = OrderDto.partial();
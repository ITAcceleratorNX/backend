import { z } from 'zod';

export const CARGO_MARKS = z.enum(["NO", "FRAGILE", "HEAVY"]);
export const ORDER_STATUSES = z.enum(["INACTIVE", "APPROVED", "ACTIVE"]);
export const OrderDto = z.object({
    storage_id: z.number({
        required_error: 'storage_id is required',
        invalid_type_error: 'storage_id must be a number',
    }),
    total_volume: z.number().gt(0),
    months: z.number().int().min(1),
    cargo_mark: CARGO_MARKS,
    product_names: z.string().nonempty(),
});

export const OrderStatusDto = z.object({
    status: ORDER_STATUSES
})

export const OrderUpdateDto = OrderDto.partial();
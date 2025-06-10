import { z } from 'zod';

export const CARGO_MARKS = z.enum(["NO", "FRAGILE", "HEAVY"]);

export const OrderDto = z.object({
    storage_id: z.number({
        required_error: 'storage_id is required',
        invalid_type_error: 'storage_id must be a number',
    }),
    total_volume: z.number().gte(0),
    start_date: z.coerce.date({
        required_error: 'start_date is required',
        invalid_type_error: 'start_date must be a valid date',
    }),
    end_date: z.coerce.date({
        required_error: 'end_date is required',
        invalid_type_error: 'end_date must be a valid date',
    }),
    cargo_mark: CARGO_MARKS,
    product_names: z.string().nonempty()
});

export const OrderUpdateDto = OrderDto.partial();


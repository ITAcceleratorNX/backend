import { z } from 'zod';

export const OrderDto = z.object({
    storage_id: z.number({
        required_error: 'storage_id is required',
        invalid_type_error: 'storage_id must be a number',
    }),
    start_date: z.coerce.date({
        required_error: 'start_date is required',
        invalid_type_error: 'start_date must be a valid date',
    }),
    end_date: z.coerce.date({
        required_error: 'end_date is required',
        invalid_type_error: 'end_date must be a valid date',
    }),
    cell_ids: z.array(z.number({
        invalid_type_error: 'Each cell_id must be a number'
    })).min(1, 'At least one cell_id is required')
});

export const OrderUpdateDto = OrderDto.partial();


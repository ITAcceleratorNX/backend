import { z } from 'zod';

export const CloudStorageOrderDto = z.object({
    user_id: z.number().int().positive(),
    storage_id: z.number().int().positive(),
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
    rental_start: z.coerce.date(),
    rental_end: z.coerce.date(),
});

export const UpdateCloudStorageOrderDto = CloudStorageOrderDto.partial();
import { z } from 'zod';

export const CloudItemDto = z.object({
    storage_order_id: z.number().int().positive(),
    description: z.string().min(1),
    volume: z.number().positive(),
    category_code: z.string().min(1),
});

export const UpdateCloudItemDto = CloudItemDto.partial();
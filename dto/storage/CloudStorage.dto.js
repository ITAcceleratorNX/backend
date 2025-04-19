import { z } from 'zod';

export const CloudStorageDto = z.object({
    warehouse_id: z.number().int().positive(),
    type_id: z.number().int().positive(),
    total_volume: z.number().positive(),
    status: z.enum(['active', 'completed']),
});

export const UpdateCloudStorageDto = CloudStorageDto.partial();
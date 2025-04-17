import { z } from 'zod';

export const IndividualStorageDto = z.object({
    warehouse_id: z.number().int().positive(),
    total_volume: z.number().int().positive(),
});

export const UpdateIndividualStorageDto = IndividualStorageDto.partial();
